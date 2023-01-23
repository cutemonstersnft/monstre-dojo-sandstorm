import { Metadata, Metaplex, Nft } from "@metaplex-foundation/js"
import { useEffect, useState } from "react"
import NftDisplay from "../components/NftDisplay"
import { MTNFREN_COLLECTION_ADDRESS } from "../lib/addresses"
import { Connection, PublicKey } from "@solana/web3.js"
import redis from '../lib/redis'
import Head from 'next/head'
import type { NextApiRequest } from 'next'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  
  const pubkey = redis.get("cache", (err, result) => {
    
  });
  return redis.get("cache").then(result => {
    return { props: { pubkey: result } }
  })

}
export default function Holders(props: { pubkey: string }) {
  const wallet = new PublicKey(props.pubkey)
  // insert own RPC const connection = new Connection();
  const [userNfts, setUserNfts] = useState<Nft[]>([])
  

  const metaplex = Metaplex
    .make(connection) 

  const nfts = metaplex.nfts()

  async function getUserNfts() {
    if (!wallet) {
      setUserNfts([])
      return
    }
    
    // Fetch all the user's NFTs
    const userNfts = await nfts
      .findAllByOwner({ owner: wallet })

    // Filter to our collection
    const ourCollectionNfts = userNfts.filter(
      metadata =>
        metadata.collection !== null &&
        metadata.collection.verified &&
        metadata.collection.address.toBase58() === MTNFREN_COLLECTION_ADDRESS.toBase58()
    )

    // Load the JSON for each NFT 
    const loadedNfts = await Promise.all(ourCollectionNfts
      .map(metadata => {
        return nfts
          .load({ metadata: metadata as Metadata })
      })
    )

    
    setUserNfts(loadedNfts as Nft[])
  }

  useEffect(() => {
    getUserNfts()
  }, [wallet])

  if (userNfts.length === 0) {
    return (
      <main className={styles.center}>
      <h1 className={inter.className}>Loading...</h1>
      </main>
    )
  }


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
            <a
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
            </a>
          </div>
        </div>
        <div className={styles.gridcard}>
        {userNfts.map((userNft, i) => {
  if (userNft.json !== null) {
    return <div key={i} className={styles.card}><NftDisplay json={userNft.json} /></div>;
  }
  return null;
})} </div> 
    </main>
  </>
)
          }