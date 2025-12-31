
export const renderName = (name: string, length?: number, noDot?: boolean) => {
    if (name.length > (length || 50)) {
      const newName = name.slice(0, length || 50);
      return newName.concat(!noDot ? '...' : '');
    }
    return name;
  };