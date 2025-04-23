import { getSlugDexTool } from '@/utils/getNameCrypto';
import { useState, useEffect, useCallback } from 'react';

interface UseTokenImagePathProps {
  chain?: string;
  address?: string;
}

export const useTokenImagePath = ({ chain, address }: UseTokenImagePathProps) => {
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  

  // Get DexScreener path
  const getDexScreenerPath = useCallback(() => {
    return `https://dd.dexscreener.com/ds-data/tokens/${chain}/${
      chain === 'solana' ? address : address?.toLowerCase()
    }`;
  }, [chain, address]);

  // Get DexTools path
  const getDexToolsPath = useCallback(() => {
    const slug = getSlugDexTool(chain || ''); // Assuming this function exists
    return `https://www.dextools.io/resources/tokens/logos/${slug}/${
      chain === 'solana' ? address : address?.toLowerCase()
    }`;
  }, [chain, address]);


  
  const checkImageAvailability = useCallback(async (path: string, extension: string) => {
    try {
      const response = await fetch(`${path}.${extension}`, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }, []);

  // Try all image formats
  const tryAllFormats = useCallback(async (path: string) => {
    const formats = ['png', 'webp', 'jpeg', 'jpg'];
    
    for (const format of formats) {
      const isAvailable = await checkImageAvailability(path, format);
      if (isAvailable) {
        return `${path}.${format}`;
      }
    }
    return null;
  }, [checkImageAvailability]);

  // Main fetch logic
  const fetchImagePath = useCallback(async () => {
    setIsLoading(true);
    
    // Try DexScreener first
    const dexScreenerPath = getDexScreenerPath();

    const dexScreenerResult = await tryAllFormats(dexScreenerPath);

    if (dexScreenerResult) {
      setCurrentPath(dexScreenerResult);
      setIsLoading(false);
      return;
    }

    // Fallback to DexTools
    const dexToolsPath = getDexToolsPath();
    
    const dexToolsResult = await tryAllFormats(dexToolsPath);

    setCurrentPath(dexToolsResult);
    setIsLoading(false);
  }, [getDexScreenerPath, getDexToolsPath, tryAllFormats]);

  useEffect(() => {
    if(chain && address){
        fetchImagePath();
    }
  }, [fetchImagePath, chain, address]);

  return {
    path: currentPath,
    isLoading,
    error: !currentPath && !isLoading ? 'No valid image path found' : null
  };
};
