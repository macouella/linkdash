import cn from "classnames";
import matchSorter from "match-sorter";
import * as React from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ILinkdashRow } from "../src_lib/types";
import ls from "./ls";
import words from "./words";

const GLOBAL_KEYS = ["Enter", "ArrowDown", "Tab", "ArrowDown", "Shift", "Meta"];

const Nothing = () => <p>{words.nothing}</p>;

const Menu = ({ children, closeMenu }: { closeMenu: any; children: React.ReactNode }) => {
  return (
    <div className="menu">
      <div className="menu-back" onClick={closeMenu}></div>
      <div className="menu-content">{children}</div>
    </div>
  );
};

const CantLoad = ({ loadType }: { loadType: string }) => {
  return (
    <div>
      <p>
        {words.cantLoad} {loadType}
      </p>
      <p>{words.cantLoadCheck}</p>
      <pre
        dangerouslySetInnerHTML={{
          __html: words.cantLoadExample,
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

const sortCount = (a: ILinkdashRow, b: ILinkdashRow) => {
  return (b.count || 0) - (a.count || 0);
};

const Linkie = memo(
  ({
    group,
    title,
    href,
    isHighlighted,
    isBookmarked,
    onMouseOver,
    id,
    idx,
    count,
    onAction,
  }: ILinkdashRow & {
    isHighlighted?: boolean;
    isBookmarked?: boolean;
    idx: number;
    onAction: any;
    onMouseOver: any;
  }) => {
    const aRef = useRef<HTMLAnchorElement | null>(null);
    useEffect(() => {
      if (isHighlighted && aRef.current) {
        const rect = aRef.current.getBoundingClientRect();
        const isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth);

        if (!isInViewport) {
          aRef.current.scrollIntoView();
        }
      }
    }, [isHighlighted, aRef]);
    return (
      <a
        onClick={onAction(id)}
        onMouseOver={onMouseOver(idx)}
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
        <span className="search-item-count">{count ? count : words.space}</span>
        <span
          className={cn("search-item-bookmark", {
            "search-item-bookmark--active": isBookmarked,
          })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M352,48H160a48,48,0,0,0-48,48V464L256,336,400,464V96A48,48,0,0,0,352,48Z"
              style={{
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "32px",
              }}
            />
          </svg>
        </span>
      </a>
    );
  }
);

export default function ({
  rows: _rows,
  isLoadingDone,
  loadType,
  enableAutoMenu,
}: {
  rows?: ILinkdashRow[];
  isLoadingDone?: boolean;
  enableAutoMenu?: boolean;
  loadType: string;
}) {
  const [uiStore, setUiStore] = useState<
    Record<
      string,
      {
        count: number;
        isBookmarked: boolean;
      }
    >
  >(ls.get("uiStore") || {});

  const searchEl = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState<string>();
  const [lastAction, setLastAction] = useState<string>();
  const [isMenuOpen, setIsMenuOpen] = useState(enableAutoMenu && !ls.get("introDone"));
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const [navMode, setNavMode] = useState<"keyboard" | "mouse">("keyboard");
  const [rows, setRows] = useState<ILinkdashRow[]>();

  const closeMenu = () => {
    ls.set("introDone", 1);
    setIsMenuOpen(false);
  };
  useEffect(() => {
    const handle = (evt: any) => {
      if (isMenuOpen && evt.key === "Escape") {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
    };
  }, [setIsMenuOpen]);

  useEffect(() => {
    if (_rows) {
      // merges the uiStore with the rows
      const preppedRows = _rows.map((row) => ({ ...row, ...uiStore[row.id!] }));
      setRows(preppedRows);
    }
  }, [_rows, uiStore]);

  const results = useMemo(() => {
    if (rows) {
      if (filter && !filter.match(/^#/)) {
        return matchSorter(rows, filter, {
          keys: ["href", "title", "group", "keywords", "catchall"],
        });
      }
      if (filter === "#t") {
        return rows.sort(sortCount);
      } else if (filter === "#b") {
        return rows.filter((r) => r.isBookmarked).sort(sortCount);
      }

      return rows.sort(sortAlphabetical);
    }
  }, [filter, rows]);

  const toggleBookmark = useCallback(
    (key: string) => {
      setUiStore((old) => {
        const oldVal = old[key] || {};
        return {
          ...old,
          [key]: {
            ...oldVal,
            isBookmarked: !oldVal.isBookmarked,
          },
        };
      });
    },
    [setUiStore]
  );

  const handleAction = useCallback(
    (key) => (evt?: any) => {
      if (evt) {
        if (
          evt.target &&
          (evt.target.closest(".search-item-bookmark") ||
            evt.target.classList.contains(".search-item-bookmark"))
        ) {
          evt.preventDefault();
          toggleBookmark(key);
          return false;
        }
      }

      setUiStore((old) => {
        const oldVal = old[key] || {};
        const oldCount = oldVal.count || 0;
        let newCount = 1;
        if (oldVal) {
          newCount = oldCount + 1;
        }
        return {
          ...old,
          [key]: { ...oldVal, count: newCount },
        };
      });
    },
    [uiStore, setUiStore, searchEl.current]
  );

  useEffect(() => {
    try {
      ls.set("uiStore", uiStore);
    } catch (e) {
      // can't do that
    }
  }, [uiStore]);

  const selectedRow = results && results[highlightedIdx];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (GLOBAL_KEYS.includes(e.key)) e.preventDefault();
      if (e.key === "Enter" && selectedRow) {
        handleAction(selectedRow.id)();
        window.open(selectedRow.href, selectedRow.href);
      } else if (e.key === " " && selectedRow && lastAction === "move") {
        toggleBookmark(selectedRow.id!);
        e.preventDefault();
      } else if (e.key == "ArrowDown" || e.key === "Tab") {
        setHighlightedIdx((old) => {
          if (results!.length > old + 1) {
            return old + 1;
          }
          return old;
        });
        setNavMode("keyboard");
        setLastAction("move");
        e.preventDefault();
      } else if (e.key == "ArrowUp") {
        setHighlightedIdx((old) => {
          if (old - 1 >= 0) {
            return old - 1;
          }
          return old;
        });
        setNavMode("keyboard");
        setLastAction("move");
        e.preventDefault();
      } else if (e.metaKey || e.shiftKey || e.ctrlKey) {
        setNavMode("keyboard");
        setLastAction("search");
      } else {
        if (!searchEl.current?.disabled) {
          searchEl.current?.focus();
          setHighlightedIdx(0);
          setNavMode("keyboard");
          setLastAction("search");
        }
      }
    },
    [selectedRow, searchEl.current, isMenuOpen]
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
      } else if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleType);
    return () => {
      document.addEventListener("keydown", handleType);
    };
  }, [searchEl.current, isMenuOpen]);

  const handleMouseOver = useCallback(
    (idx: number) => {
      return (evt: any) => {
        if (evt.clientY < window.innerHeight - 30) {
          setHighlightedIdx(idx);
          setLastAction("move");
          setNavMode("mouse");
        }
      };
    },
    [setHighlightedIdx, setLastAction, setNavMode]
  );

  const isDisplayCantLoad = isLoadingDone && !rows;
  const isDisplayNothing = results && !results.length;

  return (
    <div
      className={cn("terminal", {
        "terminal--mouse": navMode === "mouse",
      })}
      onMouseLeave={() => {
        setNavMode("keyboard");
      }}
    >
      {isMenuOpen && (
        <Menu closeMenu={closeMenu}>
          <h4 className="menu-title">Linkdash quickstart</h4>
          <dl className="menu-list">
            {Object.entries(words.menuCommands).map(([dt, dd]) => {
              return (
                <div key={`${dt}`}>
                  <dt>{dt}</dt>
                  <dd>{dd}</dd>
                </div>
              );
            })}
          </dl>
          <div className="buttons">
            <button
              onClick={() => {
                closeMenu();
              }}
              type="button"
              className="button button--dark"
            >
              {words.menuClose}
            </button>
            <button
              className="button"
              type="button"
              onClick={() => {
                setUiStore((uiStore) =>
                  Object.entries(uiStore).reduce((acc, [k, v]) => {
                    acc[k] = {
                      ...v,
                      count: 0,
                    };
                    return acc;
                  }, {} as any)
                );
                closeMenu();
              }}
            >
              {words.reset}
            </button>
          </div>
        </Menu>
      )}
      <div className="topbar">
        <div className="topbar-left">
          <input
            ref={searchEl}
            onKeyDown={handleKeyDown}
            placeholder={words.searchPlaceholder}
            autoFocus
            className="input-search"
            onChange={(e) => {
              setFilter(e.currentTarget.value);
            }}
            disabled={isLoadingDone && !rows}
          />
        </div>
        <div className="topbar-right">
          <button
            className="button"
            onClick={() => {
              setIsMenuOpen(true);
            }}
          >
            {words.menu}
          </button>
        </div>
      </div>
      <div className="mid">
        {isDisplayNothing && <Nothing />}
        {!isLoadingDone && <Loader message={`${words.loaderMessage} ${loadType}...`} />}
        {isDisplayCantLoad && <CantLoad loadType={loadType} />}
        {results &&
          results.map((x, idx) => (
            <Linkie
              onMouseOver={handleMouseOver}
              onAction={handleAction}
              isHighlighted={highlightedIdx === idx}
              id={x.id}
              idx={idx}
              {...x}
              key={x.id}
            />
          ))}
      </div>
    </div>
  );
}
