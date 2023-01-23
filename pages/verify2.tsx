import { createQR, encodeURL, findReference, FindReferenceError, TransactionRequestURLFields } from "@solana/pay";
import { Connection, Keypair } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })


export default function Checkout() {
  const router = useRouter()

  // ref to a div where we'll show the QR code
  const qrRef = useRef<HTMLDivElement>(null)


  // Read the URL query (which includes our chosen products)
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(router.query)) {
    if (value) {
      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(key, v);
        }
      } else {
        searchParams.append(key, value);
      }
    }
  }

  // Generate the unique reference which will be used for this transaction
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  // Add it to the params we'll pass to the API
  searchParams.append('reference', reference.toString());

  // Get a connection to Solana devnet
  const connection = new Connection(`https://rpc.helius.xyz/?api-key=1355b411-b18d-418c-8f7b-d7a8c45d1ab0`);


  // Show the QR code
  useEffect(() => {
    // window.location is only available in the browser, so create the URL in here
    const { location } = window
    const apiUrl = `${location.protocol}//${location.host}/api/verify2?${searchParams.toString()}`
    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl),
    }
    const solanaUrl = encodeURL(urlParams)
    const qr = createQR(solanaUrl, 350)
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    }
  })

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' })
        // Navigate to the confirmed page if no errors are thrown
        router.push('/holders2')
      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return;
        }
        console.error('Unknown error', e)
      }
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
      <>
              <Head>
        <title>Monstrè NFT Verification</title>
        <meta name="description" content="NFT Verification Powered by Solana Pay" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div>
            <Link
              href="https://monstre.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/vercel.svg"
                alt="Monstrè Logo"
                className={styles.vercelLogo}
                width={170}
                height={60}
                priority
              />
            </Link>
          </div>
        </div>
          <div>
            <div 
            className={styles.center} 
            ref={qrRef} 
            />
          </div>
        </main>
      </>
    )
}