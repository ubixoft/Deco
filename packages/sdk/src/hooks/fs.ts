import { useEffect, useState } from "react";
import { type FileSystemOptions, SDK } from "../index.ts";

const isErrorLike = (value: unknown): value is Error =>
  typeof value === "object" && value !== null && "message" in value &&
  "stack" in value;

/**
 * Reads the contents of a file.
 *
 * @example
 * ```typescript
 * const file = useFile("/path/to/file");
 * ```
 *
 * @param path - Path to the file to read
 * @returns Promise resolving to the file contents. Returns null when loading.
 */
export const useFile = (path: string, options?: FileSystemOptions) => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancel = false;

    const readFile = async () => {
      setLoading(true);
      setError(null);

      const content = await SDK.fs.read(path, {
        encoding: options?.encoding,
        mode: options?.mode,
        flag: options?.flag,
      });

      if (cancel) {
        return;
      }

      if (isErrorLike(content)) {
        setError(content);
      } else {
        setData(content);
      }

      setLoading(false);
    };

    readFile();

    const unsubscribe = SDK.fs.onChange(async (event) => {
      const resolved = await SDK.fs.resolvePath(path);

      if (event.path !== resolved) {
        return;
      }

      readFile();
    });

    return () => {
      cancel = true;
      unsubscribe?.();
    };
  }, [path, options?.encoding, options?.mode, options?.flag]);

  return { data, loading, error };
};

/**
 * Lists files and directories in a directory.
 *
 * @example
 * ```typescript
 * const entries = useFileList("/path/to/directory");
 * ```
 *
 * @param path - Path to the directory to list
 * @returns Promise resolving to an array of file paths. Returns null when loading.
 */
export const useFileList = (
  path: string,
  options?: { recursive?: boolean },
) => {
  const [entries, setEntries] = useState<string[] | null>(null);

  useEffect(() => {
    let cancel = false;

    const readDir = async () => {
      const entries = await SDK.fs.list(path, {
        recursive: options?.recursive,
      });

      if (cancel) {
        return;
      }

      setEntries(entries);
    };

    setEntries(null);
    readDir().catch(console.error);

    const unsubscribe = SDK.fs.onChange(async (event) => {
      const resolved = await SDK.fs.resolvePath(path);

      if (!event.path.includes(resolved)) {
        return;
      }

      readDir();
    });

    return () => {
      cancel = true;
      unsubscribe?.();
    };
  }, [path, options?.recursive]);

  return entries;
};
