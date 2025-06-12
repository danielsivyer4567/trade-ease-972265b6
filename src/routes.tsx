import { TagNotificationView } from '@/components/tags/TagNotificationView';
import { fetchTagData } from '@/services/tagService';
import { Route } from 'react-router-dom';
import Automations from '@/pages/Automations';
import N8nWorkflowListPage from '@/pages/Workflow/n8n-workflow-list';
import N8nWorkflowPage from '@/pages/Workflow/n8n-workflow';

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
    element: <N8nWorkflowListPage />
  },
  {
    path: '/workflow/list',
    element: <N8nWorkflowListPage />
  },
  {
    path: '/workflow/new',
    element: <N8nWorkflowPage />
  },
  {
    path: '/workflow/edit/:id',
    element: <N8nWorkflowPage />
  },
  {
    path: '/workflow/automations',
    element: <Automations />
  },
  {
    path: '/automations',
    element: <Automations />
  }
]; 