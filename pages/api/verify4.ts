import { getAssociatedTokenAddress, getMint, createBurnCheckedInstruction } from "@solana/spl-token"
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js"
import { NextApiRequest, NextApiResponse } from "next"
import { MTNFREN_COLLECTION_ADDRESS, bonkAddress } from "../../lib/addresses"
import base58 from 'bs58'
import { Metaplex} from "@metaplex-foundation/js"
import redis from '../../lib/redis'

export type MakeTransactionInputData = {
  account: string,
}

type MakeTransactionGetResponse = {
  label: string,
  icon: string,
}

export type MakeTransactionOutputData = {
  transaction: string,
  message: string,
}

type ErrorOutput = {
  error: string
}

function get(res: NextApiResponse<MakeTransactionGetResponse>) {
  res.status(200).json({
    label: "Monstrè Authentication",
    icon: "https://shdw-drive.genesysgo.net/HcnRQ2WJHfJzSgPrs4pPtEkiQjYTu1Bf6DmMns1yEWr8/monstre%20logo.png",
  })
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionOutputData | ErrorOutput>
) {
  try {
    const { reference } = req.query
    if (!reference) {
      res.status(400).json({ error: "No reference provided" })
      return
    }

    // We pass the buyer's public key in JSON body
    const { account } = req.body as MakeTransactionInputData
    if (!account) {
      res.status(40).json({ error: "No account provided" })
      return
    }
    const shopPrivateKey = process.env.SHOP_PRIVATE_KEY as string
    if (!shopPrivateKey) {
      res.status(500).json({ error: "Shop private key not available" })
    }
    const shopKeypair = Keypair.fromSecretKey(base58.decode(shopPrivateKey))

    const buyerPublicKey = new PublicKey(account)
    redis.set("cache", account)
    const shopPublicKey = shopKeypair.publicKey
    const apiKey = process.env.HELIUS_API_KEY as string
    const connection = new Connection(`https://rpc.helius.xyz/?api-key=${apiKey}`);

    const metaplex = Metaplex
    .make(connection)

  
  const myNfts = await metaplex.nfts().findAllByOwner({
    owner: buyerPublicKey
});

    // Filter to our collection
    const ourCollectionNfts = myNfts.filter(
      metadata =>
        metadata.collection !== null &&
        metadata.collection.verified &&
        metadata.collection.address.toBase58() === MTNFREN_COLLECTION_ADDRESS.toBase58()
    )


    const buyerGetsCouponDiscount = ourCollectionNfts.length > 0

    // Get a recent blockhash to include in the transaction
    const { blockhash } = await (connection.getLatestBlockhash('finalized'))

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: shopPublicKey,
    })

  
    const bonkMint = await getMint(connection, bonkAddress)
    const buyerbonkAddress = await getAssociatedTokenAddress(bonkAddress, buyerPublicKey)
    const shopbonkAddress = await getAssociatedTokenAddress(bonkAddress, shopPublicKey)

    

    const amountToPay = buyerGetsCouponDiscount ? 10000 : 100000000000;

    const burnInstruction = createBurnCheckedInstruction(
      buyerbonkAddress,
      bonkAddress, 
      buyerPublicKey, 
      amountToPay * (10 ** bonkMint.decimals), 
      bonkMint.decimals, 
    )

    burnInstruction.keys.push({
      pubkey: new PublicKey(reference),
      isSigner: false,
      isWritable: false,
    })

    transaction.add(burnInstruction)

    transaction.partialSign(shopKeypair)

    // Serialize the transaction and convert to base64 to return it
    const serializedTransaction = transaction.serialize({
      // We will need the buyer to sign this transaction after it's returned to them
      requireAllSignatures: false
    })
    const base64 = serializedTransaction.toString('base64')


    const message = "Powered by Monstrè! 👾"

    // Return the serialized transaction
    res.status(200).json({
      transaction: base64,
      message,
    })
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: 'error creating transaction', })
    return
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionGetResponse | MakeTransactionOutputData | ErrorOutput>
) {
  if (req.method === "GET") {
    return get(res)
  } else if (req.method === "POST") {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}