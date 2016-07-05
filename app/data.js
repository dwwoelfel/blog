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
  nodeDefinitions
} from 'graphql-relay';

// ------------------------------------------------------------
// Database

import POSTS from '../posts';

function getPosts(limit = 0, offset = 5) {
  return _.chain(POSTS)
    .values()
    .sortBy(p => -p.createdAt)
    .slice(offset, offset + limit)
    .value()
  ;
}

function getPost(id) {
  return POSTS[id];
}

// ------------------------------------------------------------
// Node Definitions

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => getPost(fromGlobalId(globalId).id),
  (obj) => POST_TYPE,
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

const QUERY_TYPE = new GraphQLObjectType({
  name: 'Query',
  fields: {
    node: nodeField,
    posts: {
      type: new GraphQLList(POST_TYPE),
      args: {
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: function(_, {limit, offset}) {
        return getPosts(limit, offset);
      }
    },
    post: {
      type: POST_TYPE,
      args: {
        id: { type: GraphQLString },
      },
      resolve: function(_, {id}) {
        return getPost(id);
      }
    },
  },
});

const SCHEMA = new GraphQLSchema({
  query: QUERY_TYPE,
});

export default SCHEMA;
