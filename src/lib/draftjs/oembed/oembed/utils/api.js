import api from '../../../../utils/api';

export default function oembed({projectId, url}) {
  const params = {
    method: 'GET',
    path: `project/${projectId}/oembed?url=${encodeURIComponent(url)}`
  };

  return api(params);
}
