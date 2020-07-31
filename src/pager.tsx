import React from 'react';
import { get, range } from 'lodash';
import classNames from 'classnames';
import {
    faAngleDoubleLeft,
    faAngleRight,
    faAngleLeft,
    faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

import { Page } from './page';
import { RenderPages } from './render-pages';
import { ValueType, ActionMeta } from 'react-select';

type TitleKeys = 'first' | 'prev' | 'next' | 'last' | 'prevSet' | 'nextSet';

type PagerTitles = { [keys in TitleKeys]: JSX.Element };

export type PageChangedHandler = (currentPage: number) => void;
type PagerProps = {
    titles?: Partial<PagerTitles>,
    total: number,
    itemsPerPage: number,
    currentPage: number,
    visiblePages?: number,
    onPageChanged?: PageChangedHandler,
    className?: string,
    pageClassName?: string,
    mobileViewHideClass?: string,
    desktopViewHideClass?: string,
}

/**
 * ## Constants
 */
export const BASE_SHIFT = 1;

const TITLES: PagerTitles = {
    first: <FontAwesomeIcon icon={faAngleDoubleLeft} />,
    prev: <FontAwesomeIcon icon={faAngleLeft} />,
    next: <FontAwesomeIcon icon={faAngleRight} />,
    last: <FontAwesomeIcon icon={faAngleDoubleRight} />,
    prevSet: <>...</>,
    nextSet: <>...</>,
};

export const pageItems = <T extends {}>(items: T[], currentPage: number, currentItemsPerPage: number) => {
    return items.slice((currentPage - BASE_SHIFT) * currentItemsPerPage, (currentPage - BASE_SHIFT + 1) * currentItemsPerPage);
}

const defaultVisiblePages = 5

/**
 * Pager
 */
export const Pager: React.FunctionComponent<PagerProps> = ({
    total,
    itemsPerPage,
    currentPage,
    visiblePages = 5,
    titles,
    onPageChanged,
    pageClassName,
    className,
    mobileViewHideClass = "d-sm-none d-flex",
    desktopViewHideClass = "d-none d-sm-flex",
}) => {
    /* ========================= HELPERS ==============================*/
    const getTitles = (key: TitleKeys) => {
        return get(titles, key, TITLES[key]);
    }

    const totalPages = Math.ceil(total / itemsPerPage);
    const blockSize = visiblePages;
    const totalBlocks = Math.ceil(totalPages / blockSize);
    const currentBlock = Math.ceil(currentPage / blockSize) - 1;
    const startPage = currentBlock * blockSize + BASE_SHIFT;
    const endPage = Math.min(currentBlock * blockSize + blockSize + BASE_SHIFT, totalPages + BASE_SHIFT);

    const isPrevDisabled = currentPage <= BASE_SHIFT;
    const isNextDisabled = currentPage >= totalPages;
    const isPrevMoreHidden = currentBlock === 0;
    const isNextMoreHidden = currentBlock === totalBlocks - 1 || totalBlocks === 1;

    /* ========================= HANDLERS =============================*/
    const handleFirstPage = () => {
        if (!isPrevDisabled) {
            handlePageChanged(BASE_SHIFT);
        }
    }

    const handlePreviousPage = () => {
        if (!isPrevDisabled) {
            handlePageChanged(currentPage - 1);
        }
    }

    const handleNextPage = () => {
        if (!isNextDisabled) {
            handlePageChanged(currentPage + 1);
        }
    }

    const handleLastPage = () => {
        if (!isNextDisabled) {
            handlePageChanged(totalPages);
        }
    }

    type SelectOption = {
        value: number,
        label: string,
    }

    /**
     * Chooses page, that is one before min of currentPagely visible
     * pages.
     */
    const handleMorePrevPages = () => {
        handlePageChanged((currentBlock - 1) * blockSize + blockSize); // 
    }

    /**
     * Chooses page, that is one after max of currently visible
     * pages.
     */
    const handleMoreNextPages = () => {
        handlePageChanged((currentBlock + 1) * blockSize + 1);
    }

    const handlePageChanged = (num: number) => {
        const handler = onPageChanged;
        if (handler) handler(num);
    }

    type SelectChangeHandler = (options: ValueType<SelectOption>, action: ActionMeta<SelectOption>) => void;
    const handlePageChangedMobile: SelectChangeHandler = options => {
        if (options) {
            if (!Array.isArray(options)) {
                const opt = options as SelectOption;
                handlePageChanged(opt.value)
            }
        }
    }

    const allpages = range(BASE_SHIFT, totalPages + BASE_SHIFT).map(item => ({
        value: item,
        label: item.toString()
    }))

    const mobileWidth = allpages.length.toString().length + 4;

    const customSelectStyles = {
        container: (provided: any) => ({
            ...provided,
            width: `${mobileWidth}em`,
        }),
        control: (provided: any) => ({
            ...provided,
            borderRadius: `0`,
        }),
    }

    return (
        <nav>
            <ul className={classNames('pagination', className, desktopViewHideClass)}>
                <Page
                    key="btn-first-page"
                    isDisabled={isPrevDisabled}
                    onClick={handleFirstPage}
                    className={pageClassName}
                >{getTitles('first')}</Page>

                <Page
                    key="btn-prev-page"
                    isDisabled={isPrevDisabled}
                    onClick={handlePreviousPage}
                    className={pageClassName}
                >{getTitles('prev')}</Page>

                <Page
                    key="btn-prev-more"
                    isHidden={isPrevMoreHidden}
                    onClick={handleMorePrevPages}
                    className={pageClassName}
                >{getTitles('prevSet')}</Page>

                <RenderPages
                    current={currentPage}
                    onPageChanged={onPageChanged}
                    pageClassName={pageClassName}
                    start={startPage}
                    end={endPage}
                />

                <Page
                    key="btn-next-more"
                    isHidden={isNextMoreHidden}
                    onClick={handleMoreNextPages}
                    className={pageClassName}
                >{getTitles('nextSet')}</Page>

                <Page
                    key="btn-next-page"
                    isDisabled={isNextDisabled}
                    onClick={handleNextPage}
                    className={pageClassName}
                >{getTitles('next')}</Page>

                <Page
                    key="btn-last-page"
                    isDisabled={isNextDisabled}
                    onClick={handleLastPage}
                    className={pageClassName}
                >{getTitles('last')}</Page>
            </ul>

            <ul className={mobileViewHideClass}>
                <Page
                    key="btn-prev-page"
                    isDisabled={isPrevDisabled}
                    onClick={handlePreviousPage}
                    className={pageClassName}
                >{getTitles('prev')}</Page>
                <div style={{ width: `${mobileWidth}em` }}>
                    <Select
                        options={allpages}
                        value={allpages[currentPage - BASE_SHIFT]}
                        onChange={handlePageChangedMobile}
                        styles={customSelectStyles}
                    />
                </div>
                <Page
                    key="btn-next-page"
                    isDisabled={isNextDisabled}
                    onClick={handleNextPage}
                    className={pageClassName}
                >{getTitles('next')}</Page>
            </ul>
        </nav>
    );
}
