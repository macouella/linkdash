import cn from "classnames";
import matchSorter from "match-sorter";
import * as React from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ILinkdashRow } from "../src_lib/types";
import ls from "./ls";

const GLOBAL_KEYS = ["Enter", "ArrowDown", "Tab", "ArrowDown", "Shift", "Meta"];

const Nothing = () => <p>There's nothing here...</p>;

const CantLoad = ({ loadType }: { loadType: string }) => {
  return (
    <div>
      <p>Hmm... we can't seem to load {loadType}</p>
      <p>
        Please check your settings or if using the host option, ensure that your api responds with
        the following payload:
      </p>
      <pre
        dangerouslySetInnerHTML={{
          __html: `
{
 urls: [
    {
      "group": "group",
      "title": "title",
      "href": "href",
      "keywords": "optional list of searchable keywords"
    }
  ]
}
`.trim(),
        }}
      ></pre>
    </div>
  );
};

const Loader = ({ message }: { message?: string }) => (
  <div className="loader-wrap">
    <div className="loader"></div>
    {!!message && <div className="loader-message">{message}</div>}
  </div>
);

const sortAlphabetical = (a: ILinkdashRow, b: ILinkdashRow) => {
  const aTitle = [a.group, a.title].join("");
  const bTitle = [b.group, b.title].join("");

  if (aTitle < bTitle) {
    return -1;
  }
  if (aTitle > bTitle) {
    return 1;
  }
  return 0;
};

const Linkie = memo(
  ({
    group,
    title,
    href,
    isHighlighted,
    id,
    count,
    onVisit,
  }: ILinkdashRow & {
    isHighlighted?: boolean;
    onVisit: any;
  }) => {
    const aRef = useRef<HTMLAnchorElement | null>(null);
    useEffect(() => {
      if (isHighlighted && aRef.current) {
        const rect = aRef.current.getBoundingClientRect();
        const isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight ||
              document.documentElement.clientHeight) /* or $(window).height() */ &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth); /* or $(window).width() */

        if (!isInViewport) {
          aRef.current.scrollIntoView();
        }
      }
    }, [isHighlighted, aRef]);
    return (
      <a
        onClick={onVisit}
        ref={aRef}
        target={id}
        className={cn("search-item", {
          "search-item--active": isHighlighted,
        })}
        href={href}
        tabIndex={0}
      >
        <span className="search-item-group">{group}</span>
        <span className="search-item-name">{title}</span>
        <span className="search-item-count">{count ? count : "\u00A0"}</span>
      </a>
    );
  }
);

export default function ({
  rows,
  isLoadingDone,
  loadType,
}: {
  rows?: ILinkdashRow[];
  isLoadingDone?: boolean;
  loadType: string;
}) {
  const [countStore, setCountStore] = useState<Record<string, number>>(ls.get("countStore") || {});
  const searchEl = useRef<HTMLInputElement | null>(null);

  const [filter, setFilter] = useState<string>();
  const [highlightedIdx, setHighlightedIdx] = useState(0);

  const results = useMemo(() => {
    if (rows) {
      if (filter) {
        return matchSorter(rows, filter, {
          keys: ["href", "title", "group", "keywords", "catchall"],
        });
      }
      return rows.sort(sortAlphabetical);
    }
  }, [filter, rows]);

  const handleVisit = useCallback(
    (key) => () => {
      setCountStore((old) => {
        const oldCount = old[key];
        let newCount = 1;
        if (oldCount) {
          newCount = oldCount + 1;
        }
        return { ...old, [key]: newCount };
      });
      // if (searchEl.current) {
      //   searchEl.current.focus();
      // }
    },
    [countStore, setCountStore, searchEl.current]
  );

  useEffect(() => {
    try {
      ls.set("countStore", countStore);
    } catch (e) {
      // can't do that
    }
  }, [countStore]);

  useEffect(() => {
    setHighlightedIdx(0);
  }, [results]);

  const hh = results && results[highlightedIdx];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (GLOBAL_KEYS.includes(e.key)) e.preventDefault();
      if (e.key === "Enter" && hh) {
        handleVisit(hh.id)();
        window.open(hh.href, hh.href);
      } else if (e.key == "ArrowDown" || e.key === "Tab") {
        setHighlightedIdx((old) => {
          if (results!.length > old + 1) {
            return old + 1;
          }
          return old;
        });
        // searchEl.current.focus();
      } else if (e.key == "ArrowUp") {
        setHighlightedIdx((old) => {
          if (old - 1 >= 0) {
            return old - 1;
          }
          return old;
        });
      } else if (e.key !== "Meta") {
        if (!searchEl.current?.disabled) {
          searchEl.current?.focus();
        }
      }
    },
    [hh, searchEl.current]
  );

  useEffect(() => {
    const handleType = (e: KeyboardEvent) => {
      if (
        !["Shift", "Meta"].includes(e.key) &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey &&
        searchEl.current?.className != document.activeElement?.className
      ) {
        if (!searchEl.current?.disabled) {
          searchEl.current?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleType);
    return () => {
      document.addEventListener("keydown", handleType);
    };
  }, [searchEl.current]);

  return (
    <div className="terminal">
      <input
        ref={searchEl}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        autoFocus
        className="input-search"
        onChange={(e) => {
          setFilter(e.currentTarget.value);
        }}
        disabled={isLoadingDone && !rows}
      />
      {results && !results.length && <Nothing />}
      {!isLoadingDone && <Loader message={`Loading urls from ${loadType}...`} />}
      {isLoadingDone && !rows && <CantLoad loadType={loadType} />}
      {results &&
        results.map((x, idx) => (
          <Linkie
            onVisit={handleVisit(x.id)}
            isHighlighted={highlightedIdx === idx}
            id={x.id}
            {...x}
            count={countStore[x.id!]}
            key={x.id}
          />
        ))}
      {isLoadingDone && rows && !!Object.values(countStore).find((x) => x > 0) && (
        <div className="toolbar">
          <button
            className="button"
            type="button"
            onClick={() => {
              setCountStore({});
            }}
          >
            Reset counters
          </button>
        </div>
      )}
    </div>
  );
}
