"use client"; // Mark this component as a Client Component

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import  {PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
import Image from 'next/image';



const PlaidLink = ({ user, variant, accessToken }: PlaidLinkProps) => { // Add accessToken prop
    const router = useRouter();
    const [token, setToken] = useState('');
    
    useEffect(() =>{
        const getLinkToken = async () => {
            // Pass accessToken if it exists to generate an update mode token
            const data = await createLinkToken(user, accessToken);
            setToken(data?.linkToken);
            
        }
        
        getLinkToken();
    }, [user, accessToken]); // Add accessToken to dependency array
    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
    
        // Only exchange public token if NOT in update mode (i.e., accessToken was not provided)
        if (!accessToken) {
          await exchangePublicToken({
            publicToken: public_token,
            user,
          });
        }
        // In update mode, onSuccess signifies the user granted new permissions.
        // A page refresh or data re-fetch might be appropriate here.
        router.push('/');
    }, [user, accessToken, router]) // Add accessToken and router to dependency array
    const config: PlaidLinkOptions = {
        token,
        onSuccess,
        env: 'sandbox',
        product: ['transactions'],
    }

    const { open, ready} = usePlaidLink(config);
  return (
    <>
    {variant === 'primary'?(
        <Button 
        onClick={() => open()}
        disabled = {!ready}
        className='plaidlink-primary'>
            Connect Bank
        </Button>
    ): variant === 'ghost' ? (
        <Button onClick={() => open()} variant='ghost' className='plaidlink-ghost'>
            <Image 
            src = "/icons/connect-bank.svg"
            alt = "connect bank"
            width={24}
            height={24}
            />
            <p className='hidden text-[16px] font-semibold text-black-2 xl:block'>
            Connect Bank
            </p>
        </Button>
    ) : (
        <Button onClick={() => open()} className='plaidlink-default'>
            <Image 
            src = "/icons/connect-bank.svg"
            alt = "connect bank"
            width={24}
            height={24}
            />
            <p className='text-[16px] font-semibold text-black-2'>
            Connect Bank
            </p>
        </Button>
    )}
    </>
  )
}

export default PlaidLink