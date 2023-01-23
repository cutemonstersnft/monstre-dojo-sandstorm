import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin']} )

export default function Home() {
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

        <div className={styles.center}>
          <div className={styles.thirteen}>
          <h1 className={inter.className}>
              verify your NFT!
            </h1>
          </div>
        </div>

        <div className={styles.grid}>
          <Link
            href="/verify"
            className={styles.card}
            rel="noopener noreferrer"
            
          >
            <Image
              src="/collections/lem.jpeg"
              alt="13"
              width={200}
              height={200}
              style={{
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h2 className={inter.className}>
              Long Eye Monstrè <span>-&gt;</span>
            </h2>
          </Link>

          <Link
            href="/verify2"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <Image
              src="/collections/smb.png"
              alt="13"
              width={200}
              height={200}
              style={{
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h2 className={inter.className}>
              Solana Monkey Business <span>-&gt;</span>
            </h2>
          </Link>

          <Link
            href="/verify3"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <Image
              src="/collections/cybersamurai.png"
              alt="13"
              width={200}
              height={200}
              style={{
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h2 className={inter.className}>
              Cyber Samurai<span>-&gt;</span>
            </h2>
          </Link>

          <Link
            href="/verify4"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <Image
              src="/collections/mtnfren.png"
              alt="13"
              width={200}
              height={200}
              style={{
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h2 className={inter.className}>
              mtnFren <span>-&gt;</span>
            </h2>
          </Link>
        </div>
      </main>
    </>
  )
}
