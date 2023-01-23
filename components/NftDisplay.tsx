import { Inter } from '@next/font/google'
import { JsonMetadata } from "@metaplex-foundation/js"

const inter = Inter({ subsets: ['latin'] })

interface NftProps {
  json: JsonMetadata<string>
}

export default function NftDisplay({ json }: NftProps) {
  return (
    <div>
          
          <a
            href="https://monstre.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              
              src={json.image}
              alt={json.name}
              width={300}
              height={300}
              style={{
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h2 className={inter.className}>
            {json.name}
            </h2>
          </a>
        </div>
  )
}
