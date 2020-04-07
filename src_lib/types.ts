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

export interface ILinkdashCliOptions extends IQueryLinkdashConfig {
  htmlHead?: string;
  help?: string;
  output?: string | "text";
  config?: string;
  disableOpen?: boolean;
  init?: boolean;
  urls?: ILinkdashRow[];
}
