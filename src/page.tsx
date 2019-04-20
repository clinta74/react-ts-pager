import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

type PageProps = {
	isHidden?: boolean,
	isActive?: boolean,
	isDisabled?: boolean,
	className?: string,
	onClick?: React.MouseEventHandler
}

const Page: React.FunctionComponent<PageProps> = ({isHidden, isActive,  isDisabled, className, onClick, children}) => {
	if (isHidden) return null;

	const fullCss = classNames('page-item mx-1', className, { 
		'active': isActive, 
		'disabled': isDisabled
	});

	return (
		<div className={fullCss}>
			<button type="button" className="page-link" onClick={onClick}>{children}</button>
		</div>
	);
};

Page.propTypes = {
	isHidden:   PropTypes.bool,
	isActive:   PropTypes.bool,
	isDisabled: PropTypes.bool,
	className:  PropTypes.string,
	onClick:    PropTypes.func,
};

export default Page;