import { useState, useEffect } from 'react';
import { MessageHelper } from '../../helpers/MessageHelper';
import { FolderInfo, PanelSettings } from '../../models/PanelSettings';
import { Command } from '../Command';
import { CommandToCode } from '../CommandToCode';
import { TagType } from '../TagType';

const vscode = MessageHelper.getVsCodeAPI();

export default function useMessages() {
  const [metadata, setMetadata] = useState<any>({});
  const [settings, setSettings] = useState<PanelSettings>();
  const [loading, setLoading] = useState<boolean>(false);
  const [focusElm, setFocus] = useState<TagType | null>(null);
  const [folderAndFiles, setFolderAndFiles] = useState<FolderInfo[] | undefined>(undefined);

  window.addEventListener('message', event => {
    const message = event.data;
    
    switch (message.command) {
      case Command.metadata:
        setMetadata(message.data);
        setLoading(false);
        break;
      case Command.settings:
        setSettings(message.data);
        setLoading(false);
        break;
      case Command.folderInfo:
        setFolderAndFiles(message.data);
        break;
      case Command.loading:
        setLoading(message.data);
        break;
      case Command.focusOnTags:
        setFocus(TagType.tags);
        break;
      case Command.focusOnCategories:
        setFocus(TagType.categories);
        break;
    }
  });

  useEffect(() => {    
    setLoading(true);
    vscode.postMessage({ command: CommandToCode.getData });
  }, ['']);

  return {
    metadata,
    settings,
    folderAndFiles,
    focusElm,
    loading,
    unsetFocus: () => { setFocus(null) }
  };
}