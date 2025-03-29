
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useInviteCode = () => {
  const [searchParams] = useSearchParams();
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    const invite = searchParams.get('invite');
    if (invite) {
      setInviteCode(invite);
    }
  }, [searchParams]);

  return { inviteCode };
};
