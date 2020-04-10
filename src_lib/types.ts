export interface ILinkdashRow {
  id?: string;
  title: string;
  href: string;
  group: string;
  keywords?: string;
  count?: number;
  isBookmarked?: boolean;
}

export interface IBaseLinkdashConfig {
  enableAutoMenu?: boolean;
  host?: string;
  title?: string;
  urls?: ILinkdashRow[];
}

// Options passed through a config file
export interface ILinkdashFileConfig extends IBaseLinkdashConfig {
  htmlHead?: string;
  output?: string | "text";
  disableOpen?: boolean;
}

export type ILinkdashFileConfigFn = () => ILinkdashFileConfig;

export type ILinkdashCliMergedOptions = ILinkdashFileConfig & {
  config?: string;
  help?: string;
  init?: boolean;
};

// Options passed through the cli
export type ILinkdashCliArgs = Omit<ILinkdashCliMergedOptions, "urls" | "htmlHead">;

export type IBuildTemplateOptions = Omit<ILinkdashFileConfig, "output" | "disableOpen">;

export type ILinkdashHostConfig = Omit<ILinkdashFileConfig, "output">;
