# react-pager
React pagination control using BootStrap v4 and Font Awesome default icons.

## Usage
```
import { Pager } from '/react-ts-pager';
```

```
    <Pager 
        current={number} // Current page
        total={number} // Total number of items.
        itemsPerPage={number} // The items shown per page.
        visiblePages={number} // Number of page numbered buttons to show.
        titles={object} // JSX Elements used for non page number buttons ie. first (optional).
        className={string} // ClassName added to pager controls (optional).
        pageClassName={string} // ClassName add to page buttons (optional).
        onPageChanged={function} // Callback that receivce the page number that has been clicked.
        mobileViewHideClass{string} // class used to hide the mobile view. default: d-sm-none
        desktopViewHideClass{string} // class used to hide the desktop view. default: d-none d-sm-flex
    />
```

## Defaults

--Titles

You can pass any number of the properites to override the default page button content.

```
 titles = {
    first: <FontAwesomeIcon icon={faAngleDoubleLeft} />,
    prev: <FontAwesomeIcon icon={faAngleLeft} />,
    next: <FontAwesomeIcon icon={faAngleRight} />,
    last: <FontAwesomeIcon icon={faAngleDoubleRight} />,
    prevSet: <>...</>,
    nextSet: <>...</>,
};
```