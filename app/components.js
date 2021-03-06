import Relay, {createContainer} from 'react-relay';
import {Link, IndexLink} from 'react-router';
import marked from 'marked';
import React, {PropTypes, Component} from 'react';

// ------------------------------------------------------------
// Containers

class App extends Component {
  render() {
    return (
      <div style={APP_STYLE}>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

const PER_PAGE = 10;

const PostIndex = createContainer(
  class extends Component {
    render() {
      const {edges, pageInfo} = this.props.viewer.posts;
      return (
        <div>
          <div>
            {
              edges
              .map(x => x.node)
              .map(post => <Post key={post.id} post={post} />)
            }
          </div>
          {
            pageInfo.hasNextPage
              ? <Pagination first={edges.length + PER_PAGE} />
              : null
          }
        </div>
      );
    }
  },
  {
    initialVariables: {first: PER_PAGE},
    fragments: {
      viewer() {
        return Relay.QL`
          fragment on Viewer {
            posts(first: $first) {
              edges {
                cursor,
                node {
                  id,
                  title,
                  content,
                }
            	}
              pageInfo {
                hasNextPage,
              }
            }
          }
        `;
     },
    }
  },
);

const PostShow = createContainer(
  Post,
  {
    fragments: {
      post() {
        return Relay.QL`
          fragment on Post {
            id,
            title,
            content,
          }
        `;
      }
    }
  }
);

// ------------------------------------------------------------
// Components

function Header() {
  return (
    <div style={HEADER_STYLE}>
      <IndexLink to="/" style={NAME_STYLE}>Stepan Parunashvili</IndexLink>
      <a style={BUTTON_STYLE} href="mailto:stepan.p@gmail.com">Contact</a>
    </div>
  );
}

function Post({post}) {
  return (
    <div style={POST_STYLE}>
      <div style={HEADLINE_STYLE}>
        <Link style={TITLE_STYLE} to={`/post/${post.id}`}>{post.title}</Link>
      </div>
      <div
        style={CONTENT_STYLE}
        dangerouslySetInnerHTML={{__html: marked(post.content)}}>
      </div>
    </div>
  );
}
Post.propTypes = {post: PropTypes.object.isRequired};

const Pagination = ({first}) => {
  return (
    <div style={PAGINATION_BAR_STYLE}>
      <Link
        style={PAGINATION_BTN_STYLE}
        to={{
          pathname: '/',
          query: {first}
        }}>
          More &rarr;
      </Link>
    </div>
  );
}
Pagination.propTypes = {first: PropTypes.number.isRequired};

// ------------------------------------------------------------
// style

const DIN_REGULAR = 'DIN Next W01 Regular';
const DIN_LIGHT = 'DIN Next W01 Light';
const STOPA_BLACK = '#444';
const STOPA_RED = '#c0392b';
const MARGIN = 20;

const APP_STYLE = {
  width: '500px',
  margin: `${MARGIN * 2}px auto ${MARGIN * 2}px auto`
}

const HEADER_STYLE = {
  textAlign: 'center',
};

const NAME_STYLE = {
  fontFamily: DIN_LIGHT,
  textTransform: 'uppercase',
  fontWeight: 'normal',
  letterSpacing: '5px',
  fontSize: '20px',
  color: STOPA_BLACK,
  display: 'block',
  textDecoration: 'none',
  margin: `${MARGIN}px 0`,
};

const BUTTON_STYLE = {
  fontFamily: DIN_REGULAR,
  textTransform: 'uppercase',
  textDecoration: 'none',
  color: STOPA_RED,
};

const HEADLINE_STYLE = {
  textAlign: 'center',
};

const TITLE_STYLE = {
  fontFamily: DIN_LIGHT,
  fontSize: '32px',
  fontWeight: 'normal',
  margin: `${MARGIN}px 0`,
  display: 'inline-block',
  color: STOPA_BLACK,
  textDecoration: 'none',
};

const SUBTITLE_STYLE = {
  fontFamily: DIN_LIGHT,
  fontSize: '19px',
};

const CONTENT_STYLE = {
  fontFamily: DIN_LIGHT,
  fontSize: '19px',
  lineHeight: '1.5',
};

const POST_STYLE = {
  paddingBottom: `${MARGIN}px`,
};

const PAGINATION_BAR_STYLE = {
  display: 'flex',
  justifyContent: 'center',
};

const BTN_RESET = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
}

const PAGINATION_BTN_STYLE = {
  ...BTN_RESET,
  textDecoration: 'none',
  color: STOPA_RED,
  fontFamily: DIN_LIGHT,
  fontSize: '15px',
};


export {App, PostIndex, PostShow};
