const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const {buildSchema} = require('graphql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

app.use(cors())

// data
const {courses} = require('./data.json');
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
// console.log(courses)
// para constuir el esquema
const schema = buildSchema(`
    type Query{
        course(id: Int!): Course
        courses(topic: String): [Course]
    }

    type Mutation{
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        description: String
        author: String
        topic: String
        url: String
    }
`);

// funciones
let getCourse = (args) => {
    let id = args.id;
    return courses.filter(course => {
        return course.id == id;
    })[0];
  }

let getCourses = (args) => {
    if(args.topic){
        let topic = args.topic;
        return courses.filter(course => {
            return course.topic === topic;
        })[0]
    }
    return courses;
}

let updateCourseTopic = ({id, topic}) =>{
    courses.map(course => {
        if(course.id === id){
            course.topic = topic;
            return course;
        }
    })
    return courses.filter(course => course.id === id)[0]
}

// que se puede consultar
const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
}
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))


app.listen(3001, () => console.log('server on port 3001'))

// const { ApolloServer, gql } = require('apollo-server');


// // A schema is a collection of type definitions (hence "typeDefs")
// // that together define the "shape" of queries that are executed against
// // your data.
// const typeDefs = gql`
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Book {
//     title: String
//     author: String
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//   }
// `;

// const books = [
//     {
//       title: 'The Awakening',
//       author: 'Kate Chopin',
//     },
//     {
//       title: 'City of Glass',
//       author: 'Paul Auster',
//     },
//   ];

//   const resolvers = {
//     Query: {
//       books: () => books,
//     },
//   };

//   const server = new ApolloServer({ typeDefs, resolvers });
// // The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });