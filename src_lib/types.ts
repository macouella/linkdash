export interface ILinkdashRow {
  id: string;
  title: string;
  href: string;
  group: string;
  keywords?: string;
  count?: number;
}

export interface IQueryLinkdashConfig {
  host?: string;
  title?: string;
}

export interface ILinkdashConfig extends IQueryLinkdashConfig {
  urls?: ILinkdashRow[];
}

export interface ILinkdashCliOptions {
  host?: string;
  help?: string;
  output?: string | "text";
  config?: string;
  disableOpen?: boolean;
  title?: string;
  init?: boolean;
}
