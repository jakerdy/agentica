//----------------------- Types ------------------------//

export interface IInitOptions
{
  stack: string;
  name?: string;
}

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
