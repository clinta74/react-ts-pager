import React from 'react';
import { range } from 'lodash';
import { PageChangedHandler} from './pager';
import { Page } from './page';

type RenderPagesParams = {
  start: number;
  end: number;
  current: number,
  onPageChanged?: PageChangedHandler,
  pageClassName?: string,
}
type RenderPagesHandler = (params: RenderPagesParams) => JSX.Element;

export const RenderPages: RenderPagesHandler = ({ start, end, current, onPageChanged, pageClassName }) => {
  const ranges = range(start, end);
  return (
      <>
          {
             ranges.map(num => {
                  const isActive = (current === num);

                  return (
                      <Page
                          key={`btn-${num}-page`}
                          isActive={isActive}
                          onClick={() => onPageChanged && onPageChanged(num)}
                          className={pageClassName}
                      >{num}</Page>
                  );
              })
          }
      </>
  );
}