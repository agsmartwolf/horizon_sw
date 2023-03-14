import { ReactNode, useMemo } from 'react';
import { getComponentFromType, PageSection } from 'lib/editor/sections';

/**
 * Transforms the page sections array into a list of components
 * @param sections The array of page sections
 */
const usePageSections = (sections: PageSection[]): ReactNode[] => {
  // const liveSections = useLiveEditorUpdates(sections);

  const pageSections = useMemo(
    () =>
      sections.map(section => {
        const { type, id, ...props } = section;

        const SectionComponent = getComponentFromType(type);

        if (!SectionComponent) return null;

        return <SectionComponent key={id} {...props} />;
      }),
    [sections],
  );

  return pageSections;
};

export default usePageSections;
