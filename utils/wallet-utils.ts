/**
 * ウォレットアドレスを省略して表示する関数
 * 
 * @param address ウォレットアドレス
 * @param prefixLength 先頭の表示文字数 (デフォルト: 5)
 * @param suffixLength 末尾の表示文字数 (デフォルト: 4)
 * @returns 省略されたアドレス文字列
 */
export function shortenAddress(
  address: string | undefined,
  prefixLength: number = 5,
  suffixLength: number = 4
): string {
  if (!address) return "";
  if (address.length <= prefixLength + suffixLength) return address;
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
} 