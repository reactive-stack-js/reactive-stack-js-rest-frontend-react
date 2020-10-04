import _ from "lodash";
import React, {useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';

import AuthService from "../../../util/auth.service";
import loremsConfigUpdate from "./_store/_f.lorems.config.update";

import './Lorems.css';
import LoremsRows from "./Rows";
import Preview from "./preview/Preview";
import ClientSocket from "../../../util/client.socket";
import LoremsUpdater from "./_store/lorems.updater";

const MIN_PAGE_SIZE = 5;
const MAX_PAGE_SIZE = 25;

const Lorems = () => {

	let updater;

	useEffect(() => {
		let init = async () => {
			await ClientSocket.location();
			if (AuthService.loggedIn()) {
				updater = new LoremsUpdater();
				loremsConfigUpdate();
			}
		};
		init();

		return () => {
			if (updater) updater.destroy();
			updater = null;
		};
	}, []);

	const [page, _setPage] = useState(1);
	const [pageSize, _setPageSize] = useState(10);
	const [search, _setSearch] = useState('');
	const [sort, _setSort] = useState({createdAt: -1});

	const setPage = (page) => {
		_setPage(page);
		loremsConfigUpdate({page, pageSize, search, sort});
	};

	const setPageSize = (pageSize) => {
		_setPageSize(pageSize);
		loremsConfigUpdate({page, pageSize, search, sort});
	};

	const setSearch = (search) => {
		_setSearch(search);
		loremsConfigUpdate({page, pageSize, search, sort});
	};

	const setSort = (sort) => {
		_setSort(sort);
		loremsConfigUpdate({page, pageSize, search, sort});
	};

	const _toggleSortingHelper = (sorting, label) => {
		let sortingLabel = _.get(sorting, label, false);
		if (sorting && sortingLabel) {
			if (sortingLabel < 0) _.set(sorting, label, 1);
			else if (sortingLabel > 0) _.set(sorting, label, 0);
			else _.set(sorting, label, -1);
		} else {
			_.set(sorting, label, -1);
		}
		return sorting;
	};

	const toggleSorting = async (label) => {
		let sorting = _.cloneDeep(sort);
		if (label === 'firstname') {
			sorting = _toggleSortingHelper(sorting, 'firstname');
			sorting = _toggleSortingHelper(sorting, 'lastname');
		} else {
			sorting = _toggleSortingHelper(sorting, label);
		}

		if (sorting['createdAt']) {
			let createdAt = sorting['createdAt'];
			delete sorting['createdAt'];
			sorting['createdAt'] = createdAt;
		}
		sorting = _.pickBy(sorting, _.identity);
		await setSort(sorting);
	};

	const getIcon = (label) => {
		if (sort) {
			let sortingLabel = _.get(sort, label, false);
			if (sortingLabel) {
				if (sortingLabel < 0) return 'fa fa-long-arrow-down';
				if (sortingLabel > 0) return 'fa fa-long-arrow-up';
			}
		}
		return '';
	};

	const store = useSelector(store => store);
	let totalCount = store.lorems.totalCount || 0;
	let pageCount = parseInt(totalCount / pageSize, 10) + 1;

	if (!AuthService.loggedIn()) {
		return (
			<p style={{padding: 20}}>Sorry, you have to sign in to see the data.</p>
		);
	}

	const renderControls = () => {
		return (
			<div id="lorems-controls">
				Page <b>{page}</b> of <b>{pageCount}</b>
				&nbsp;
				<button disabled={page <= 1} onClick={() => setPage(page - 1)}>-</button>
				&nbsp;
				<button disabled={page >= pageCount} onClick={() => setPage(page + 1)}>+</button>
				&nbsp;
				|
				&nbsp;
				Page size <b>{pageSize}</b>
				&nbsp;
				<button disabled={pageSize <= MIN_PAGE_SIZE} onClick={() => setPageSize(pageSize - 1)}>-</button>
				&nbsp;
				<button disabled={pageSize >= MAX_PAGE_SIZE} onClick={() => setPageSize(pageSize + 1)}>+</button>
				&nbsp;
				|
				&nbsp;
				<input type="text" name="search" value={search} onChange={(event) => setSearch(event.target.value)}/>
				&nbsp;
				<button disabled={_.isEmpty(search)} onClick={() => setSearch('')}>x</button>
			</div>
		);
	};

	const renderTable = () => {
		if (_.isEmpty(store.lorems.list)) {
			return (
				<p style={{padding: 20}}>Sorry, no data.</p>
			);
		}

		return (
			<div id="lorems-grid">
				<table width="100%" border="1" cellSpacing="0" cellPadding="10">
					<thead>
					<tr>
						<th align="left">#</th>
						<th align="left" onClick={() => toggleSorting('iteration')} className="nowrap">
							V. <i className={getIcon('iteration')}/>
						</th>
						<th align="left" onClick={() => toggleSorting('firstname')} className="nowrap">
							Name <i className={getIcon('firstname')}/>
						</th>
						<th align="left" onClick={() => toggleSorting('username')} className="nowrap">
							Username <i className={getIcon('username')}/>
						</th>
						<th align="left" onClick={() => toggleSorting('email')} className="nowrap">
							Email <i className={getIcon('email')}/>
						</th>
						<th align="left" onClick={() => toggleSorting('rating')} className="nowrap">
							Rating <i className={getIcon('rating')}/>
						</th>
						<th align="left" onClick={() => toggleSorting('species')} className="nowrap">
							Species <i className={getIcon('species')}/>
						</th>
						<th align="left" onClick={() => toggleSorting('description')} className="nowrap">
							Description <i className={getIcon('description')}/>
						</th>
						<th align="left" onClick={() => toggleSorting('createdAt')} className="nowrap">
							Created At <i className={getIcon('createdAt')}/>
						</th>
					</tr>
					</thead>
					<tbody>
					<LoremsRows
						page={page}
						pageSize={pageSize}
					/>
					</tbody>
				</table>
			</div>
		);
	};

	return (
		<div id="lorems-component">
			{renderControls()}

			{renderTable()}

			<div id="lorems-preview">
				<Preview/>
			</div>
		</div>
	);
};

export default connect()(Lorems);
