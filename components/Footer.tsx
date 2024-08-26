import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

interface FooterProps {
  user: { name?: string; email?: string };
  type?: 'desktop' | 'mobile';
}

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const loggedOut = await logoutAccount();

    if (loggedOut) router.push('/sign-in');
  };

  return (
    <footer className='footer'>
      <div className={type === 'mobile' ? 'footer_name_mobile' : 'footer_name'}>
        <p className='text-xl font-bold text-gray-700'>
          {user?.name ? user.name[0] : 'U'}
        </p>
      </div>

      <div className={type === 'mobile' ? 'footer_email_mobile' : 'footer_email'}>
        <h1 className='text-14 truncate text-gray-700 font-semibold'>
          {user?.name ?? 'Unknown User'}
        </h1>
        <p className='text-14 truncate font-normal text-gray-600'>
          {user?.email ?? 'No Email Provided'}
        </p>
      </div>
      
      <div className='footer_image' onClick={handleLogout}>
        <Image src='/icons/logout.svg' fill alt='logout' />
      </div>
    </footer>
  );
};

export default Footer;
