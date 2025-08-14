// Environment variables for XION configuration
export const XION_CONFIG = {
  network: import.meta.env.VITE_NETWORK || 'xion-testnet-2',
  rpcEndpoint: import.meta.env.VITE_RPC_ENDPOINT || 'https://rpc.xion-testnet-2.burnt.com:443',
  codeId: import.meta.env.VITE_CODE_ID || '1428',
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || 'xion1p735yyngmntph9cjpazmqzhhr7pn24hzw8hgjp3hemmka9qu0l4qz4t0gj',
  treasuryAddress: import.meta.env.VITE_TREASURY_ADDRESS || 'xion1apgmwm45uqf9wcrzdk4uyz24x645w9ltrqgtqpt7ek6z3rnrj2zszmma52',
  // Treasury admin info
  treasuryAdmin: 'xion16wv294qw7chfspmek2nq3tdntu0n6r93aqp7vud8a2h27hf4kfxqd4qsqk',
  // Current application URL
  appUrl: 'https://preview--xion-tap-coin.lovable.app',
} as const;

export type XionConfig = typeof XION_CONFIG;