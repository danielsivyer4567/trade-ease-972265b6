import { TagNotificationView } from '@/components/tags/TagNotificationView';
import { fetchTagData } from '@/services/tagService';
import { Route } from 'react-router-dom';
import Automations from '@/pages/Automations';
import Templates from '@/pages/Workflow/templates';
import WorkflowList from '@/pages/Workflow/WorkflowList';
import EnrollmentHistory from '@/pages/Workflow/EnrollmentHistory';
import ExecutionLogs from '@/pages/Workflow/ExecutionLogs';

export const routes = [
  {
    path: '/tags/:tagId',
    element: <TagNotificationView />,
    loader: async ({ params }) => {
      const { tagId } = params;
      // Fetch tag data from your backend
      const tagData = await fetchTagData(tagId);
      return { tagData };
    }
  },
  {
    path: '/workflow',
    element: <WorkflowList />
  },
  {
    path: '/workflow/list',
    element: <WorkflowList />
  },
  {
    path: '/workflow/templates',
    element: <Templates />
  },
  {
    path: '/workflow/enrollment-history',
    element: <EnrollmentHistory />
  },
  {
    path: '/workflow/automations',
    element: <Automations />
  },
  {
    path: '/workflow/execution-logs',
    element: <ExecutionLogs />
  },
  {
    path: '/automations',
    element: <Automations />
  }
]; 