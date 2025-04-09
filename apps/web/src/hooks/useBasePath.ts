import { useCallback } from "react";
import { useParams } from "react-router";

/**
 * Adds the right context to the pathname, i.e.
 *
 * If you are on the context of /~, it will add the /~ to it
 * If you are on the context of /shared/<teadId>, it will add the /shared/teamId to it
 */
export const useBasePath = () => {
  const { teamSlug } = useParams();

  const withBasePath = useCallback(
    (path: string) => {
      const slug = teamSlug ?? "";
      const rootWithStartingSlash = slug.replace(/(^\/)|(\/$)/g, "");
      const pathWithStartingSlash = path.replace(/(^\/)|(\/$)/g, "");

      return ["", rootWithStartingSlash, pathWithStartingSlash]
        .join("/")
        .replace(/\/\//g, "/");
    },
    [teamSlug],
  );

  return withBasePath;
};
