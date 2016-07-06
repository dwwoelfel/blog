import _ from 'lodash';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLInt
} from 'graphql';
import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray
} from 'graphql-relay';

// ------------------------------------------------------------
// Database

import POSTS from '../posts';

// TODO(stopachka)
// we should not actually need offset, as relay should
// should cache what is loaded. Look into this
function getPosts() {
  return _.chain(POSTS)
    .values()
    .sortBy(p => -p.createdAt)
    .value()
  ;
}

function getPost(id) {
  return POSTS[id];
}

function getViewer() {
  return {
    posts: [],
  };
};

// ------------------------------------------------------------
// Node Definitions

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    switch (type) {
      case 'Viewer':
        return getViewer(id);
      case 'Post':
        return getPost(id);
    }
  },
  (obj) => {
    if (obj instanceof POST_TYPE) {
      return POST_TYPE;
    } else if (obj instanceof VIEWER_TYPE) {
      return VIEWER_TYPE;
    }
  },
);

// ------------------------------------------------------------
// Types

const POST_TYPE = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: globalIdField('User'),
    title: {
      type: GraphQLString,
      resolve(x) { return x.title },
    },
    content: {
      type: GraphQLString,
      resolve(x) { return x.content },
    },
    createdAt: {
      type: GraphQLString,
      resolve(x) { return ''+x.createdAt },
    },
    updatedAt: {
      type: GraphQLString,
      resolve(x) { return ''+x.updatedAt },
    },
  },
  interfaces: [nodeInterface],
});

const {connectionType: postConnection} = connectionDefinitions(
  {name: 'Post', nodeType: POST_TYPE},
);

const VIEWER_TYPE = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    id: globalIdField('Viewer'),
    posts: {
      type: postConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getPosts(), args),
    },
  },
  interfaces: [nodeInterface],
});

const QUERY_TYPE = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
    viewer: {
      type: VIEWER_TYPE,
      resolve: () => getViewer(),
    },
    post: {
      type: POST_TYPE,
      args: {
        id: { type: GraphQLString },
      },
      resolve: function(_, {id}) {
        return getPost(id);
      },
    },
  },
});

const SCHEMA = new GraphQLSchema({
  query: QUERY_TYPE,
});

export default SCHEMA;
