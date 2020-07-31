import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import { Pager } from '../pager';


type AppProps = {};

type AppState = {
  currentPage: number;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      currentPage: 1,
    }
  }

  onChangePageHandler = (currentPage: number) => {
    this.setState({currentPage});
  }

  render() {
    const { currentPage } = this.state;
    return (
      <div className="container pt-4">
        <div className="mb-2">
          {currentPage}
        </div>
        <Pager 
          currentPage={currentPage}
          itemsPerPage={5}
          total={600}
          visiblePages={6}
          onPageChanged={this.onChangePageHandler}
        />
      </div>
    )
  }
}

const Root = hot(module)(() => <App />);

ReactDOM.render(<Root />, document.getElementById('root'));