import React from 'react';
import { WorkspaceShell } from '@/components/workspace/workspace-shell';

export {
  WORKSPACE_MODULES,
  WORKSPACE_MODULE_GROUPS,
  type WorkspaceModuleId,
} from '@/lib/workspace-config';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
