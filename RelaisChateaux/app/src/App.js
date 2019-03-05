import React, { Component } from 'react';
import './App.css';

import Data from './data/PropertiesWithStarredRestaurant.json';
import StarLogo from './star_rating_logo.png';

class App extends Component {
	constructor() {
		super();
		this.state = {
			data: Data
		};
	}

	onClickName = () => {
		this.setState({
			data: Data.sort(
				(a, b) => (a.PropertieName > b.PropertieName ? 1 : b.PropertieName > a.PropertieName ? -1 : 0)
			)
		});
	};
	onClickRatings = () => {
		this.setState({
			data: Data.sort(
				(a, b) =>
					a.Ratings > b.Ratings ? 1 : b.Ratings > a.Ratings ? -1 : 0
			)
		});
  };
  onClickStars = () => {
		this.setState({
			data: Data.sort(
				(a, b) =>
					a.Stars > b.Stars ? 1 : b.Stars > a.Stars ? -1 : 0
			)
		});
	};
	onClickPrice = () => {
		this.setState({
			data: Data.sort(
				(a, b) =>
					a.Price.length > b.Price.length
						? 1
						: a.Price.length < b.Price.length ? -1 : a.Price > b.Price ? 1 : b.price > a.price ? -1 : 0
			)
		});
	};

	render() {
		var propertiesList = this.state.data.map((propertie) => {
			if (propertie.Stars == 1) {
				return (
					<div class="row">
						<div class="cell" data-title="Propertie Name">
							<b>{propertie.PropertieName}</b>
						</div>
						<div class="cell" data-title="Price">
							{propertie.Price}
						</div>
						<div class="cell" data-title="Stars">
							<img src={StarLogo} height="20" width="20" />
						</div>
            <div class="cell" data-title="Ratings">
							{propertie.Ratings}
						</div>
						<div class="cell" data-title="Link">
							<a href={propertie.Link} target="_blank">
								<button class="button">Book</button>
							</a>
						</div>
					</div>
				);
			}
			if (propertie.Stars == 2) {
				return (
					<div class="row">
						<div class="cell" data-title="Propertie Name">
							<b>{propertie.PropertieName}</b>
						</div>
						<div class="cell" data-title="Price">
							{propertie.Price}
						</div>
						<div class="cell" data-title="Stars">
							<img src={StarLogo} height="20" width="20" />{' '}
							<img src={StarLogo} height="20" width="20" />
						</div>
            <div class="cell" data-title="Ratings">
							{propertie.Ratings}
						</div>
						<div class="cell" data-title="Link">
							<a href={propertie.Link} target="_blank">
								<button class="button">Book</button>
							</a>
						</div>
					</div>
				);
			}
			if (propertie.Stars == 3) {
				return (
					<div class="row">
						<div class="cell" data-title="Propertie Name">
							<b>{propertie.PropertieName}</b>
						</div>
						<div class="cell" data-title="Price">
							{propertie.Price}
						</div>
						<div class="cell" data-title="Stars">
							<img src={StarLogo} height="20" width="20" />
							<img src={StarLogo} height="20" width="20" />
							<img src={StarLogo} height="20" width="20" />
						</div>
            <div class="cell" data-title="Ratings">
							{propertie.Ratings}
						</div>
						<div class="cell" data-title="Link">
							<a href={propertie.Link} target="_blank">
								<button class="button">Book</button>
							</a>
						</div>
					</div>
				);
			}
		});
		return (
			<div className="App">
				<div class="limiter">
					<div class="container-table100">
						<div class="wrap-table100">
							<button onClick={this.onClickName} class="button">
								{' '}
								Sorted by Name{' '}
							</button>{' '}
							<button onClick={this.onClickPrice} class="button">
								{' '}
								Sort by Price{' '}
							</button>{' '}
							<button onClick={this.onClickStars} class="button">
								{' '}
								Sort by Stars{' '}
							</button>{' '}
              <button onClick={this.onClickRatings} class="button">
								{' '}
								Sort by Ratings{' '}
							</button>
							<div class="table">
								<div class="row header">
									<div class="cell">
										<b>Propertie Name</b>
									</div>
									<div class="cell">
										<b>Price</b> (€)
									</div>
									<div class="cell">
										<b>Stars</b>
									</div>
                  <div class="cell">
										<b>Ratings</b>
									</div>
									<div class="cell">
										<b>Link</b>
									</div>
								</div>
								{propertiesList}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
