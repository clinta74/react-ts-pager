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
import PropTypes from 'prop-types';

import Page from './page';

type TitleKeys = 'first' | 'prev' | 'next' | 'last' | 'prevSet' | 'nextSet';

type PagerTitles = { [keys in TitleKeys]: JSX.Element };

type PagerProps = {
    titles?: Partial<PagerTitles>,
    total: number,
    visiblePages: number,
    current: number
    onPageChanged?: (page: number) => void,
    className?: string,
    pageClassName?: string
}

type renderPagesPramas = {
    start: number;
    end: number;
}
type renderPagesHandler = (params: renderPagesPramas) => JSX.Element[];

/**
 * ## Constants
 */
const BASE_SHIFT = 0;
const TITLE_SHIFT = 1;

const TITLES: PagerTitles = {
    first: <FontAwesomeIcon icon={faAngleDoubleLeft} />,
    prev: <FontAwesomeIcon icon={faAngleLeft} />,
    next: <FontAwesomeIcon icon={faAngleRight} />,
    last: <FontAwesomeIcon icon={faAngleDoubleRight} />,
    prevSet: <>...</>,
    nextSet: <>...</>,
};

export const pageItems = <T extends {}>(items: T[], currentPage: number, currentItemsPerPage: number) => {
    return items.slice(currentPage * currentItemsPerPage, (currentPage + 1) * currentItemsPerPage);
}

/**
 * Pager
 */
export const Pager: React.FunctionComponent<PagerProps> = ({ 
    total, 
    visiblePages, 
    current, 
    titles, 
    onPageChanged, 
    pageClassName, 
    className 
}) => {
    /* ========================= HELPERS ==============================*/
    const getTitles = (key: TitleKeys) => {
        return get(titles, key, TITLES[key]);
    }

    /**
     * Calculates "blocks" of buttons with page numbers.
     */
    const calcBlocks = () => {
        const blockSize = visiblePages;
        const blocks = Math.ceil(total / blockSize);
        const currBlock = Math.ceil((current + TITLE_SHIFT) / blockSize) - TITLE_SHIFT;

        return {
            total: blocks,
            current: currBlock,
            size: blockSize,
        };
    }

    const isPrevDisabled = () => {
        return current <= BASE_SHIFT;
    }

    const isNextDisabled = () => {
        return current >= (total - TITLE_SHIFT);
    }

    const isPrevMoreHidden = () => {
        const blocks = calcBlocks();
        return (blocks.total === TITLE_SHIFT) || (blocks.current === BASE_SHIFT);
    }

    const isNextMoreHidden = () => {
        const blocks = calcBlocks();
        return (blocks.total === TITLE_SHIFT) || (blocks.current === (blocks.total - TITLE_SHIFT));
    }

    const visibleRange = () => {
        const blocks = calcBlocks();
        const start = blocks.current * blocks.size;
        const delta = total - start;
        const end = start + ((delta > blocks.size) ? blocks.size : delta);

        return {
            start: start + TITLE_SHIFT,
            end: end + TITLE_SHIFT
        };
    }

    /* ========================= HANDLERS =============================*/
    const handleFirstPage = () => {
        if (!isPrevDisabled()) {
            handlePageChanged(BASE_SHIFT);
        }
    }

    const handlePreviousPage = () => {
        if (!isPrevDisabled()) {
            handlePageChanged(current - TITLE_SHIFT);
        }
    }

    const handleNextPage = () => {
        if (!isNextDisabled()) {
            handlePageChanged(current + TITLE_SHIFT);
        }
    }

    const handleLastPage = () => {
        if (!isNextDisabled()) {
            handlePageChanged(total - TITLE_SHIFT);
        }
    }

    /**
     * Chooses page, that is one before min of currently visible
     * pages.
     */
    const handleMorePrevPages = () => {
        const blocks = calcBlocks();
        handlePageChanged((blocks.current * blocks.size) - TITLE_SHIFT);
    }

    /**
     * Chooses page, that is one after max of currently visible
     * pages.
     */
    const handleMoreNextPages = () => {
        const blocks = calcBlocks();
        handlePageChanged((blocks.current + TITLE_SHIFT) * blocks.size);
    }

    const handlePageChanged = (num: number) => {
        const handler = onPageChanged;
        if (handler) handler(num);
    }

    const renderPages: renderPagesHandler = ({ start, end }) => {
        return range(start, end).map((num, idx) => {
            const newCurrent = num - TITLE_SHIFT;
            const isActive = (current === newCurrent);
            const onClick: React.MouseEventHandler = () =>
                handlePageChanged(newCurrent);

            return (
                <Page
                    key={`btn-${idx}-page`}
                    isActive={isActive}
                    onClick={onClick}
                    className={pageClassName}
                >{num}</Page>
            );
        });
    }

    return (
        <nav>
            <ul className={classNames('pagination', className)}>
                <Page
                    key="btn-first-page"
                    isDisabled={isPrevDisabled()}
                    onClick={handleFirstPage}
                    className={pageClassName}
                >{getTitles('first')}</Page>

                <Page
                    key="btn-prev-page"
                    isDisabled={isPrevDisabled()}
                    onClick={handlePreviousPage}
                    className={pageClassName}
                >{getTitles('prev')}</Page>

                <Page
                    key="btn-prev-more"
                    isHidden={isPrevMoreHidden()}
                    onClick={handleMorePrevPages}
                    className={pageClassName}
                >{getTitles('prevSet')}</Page>

                {renderPages(visibleRange())}

                <Page
                    key="btn-next-more"
                    isHidden={isNextMoreHidden()}
                    onClick={handleMoreNextPages}
                    className={pageClassName}
                >{getTitles('nextSet')}</Page>

                <Page
                    key="btn-next-page"
                    isDisabled={isNextDisabled()}
                    onClick={handleNextPage}
                    className={pageClassName}
                >{getTitles('next')}</Page>

                <Page
                    key="btn-last-page"
                    isDisabled={isNextDisabled()}
                    onClick={handleLastPage}
                    className={pageClassName}
                >{getTitles('last')}</Page>
            </ul>
        </nav>
    );
}

Pager.propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    visiblePages: PropTypes.number.isRequired,
    titles: PropTypes.object,
    className: PropTypes.string,
    onPageChanged: PropTypes.func,
    pageClassName: PropTypes.string,
};
