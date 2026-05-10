//----------------------- Types ------------------------//

export interface IInitOptions
{
  stack: string;
  name?: string;
  agents_sections?: TAgentsSectionId[];
}

export type TAgentsSectionId = "lang" | "anti-spaghetti" | "use-agentica";

export interface IStackDefinition
{
  lang: string;
  type: string;
}

export interface IVSCodeSettings
{
  "chat.promptFilesLocations"?: Record<string, boolean>;
  "chat.agentSkillsLocations"?: Record<string, boolean>;
  [key: string]: unknown;
}

export interface IVSCodeExtensions
{
  recommendations?: string[];
  [key: string]: unknown;
}
