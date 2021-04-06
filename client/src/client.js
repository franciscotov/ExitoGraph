import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache()
});
// http://localhost:3001/graphql
// https://48p1r2roz4.sse.codesandbox.io

// client
//   .query({
//     query: gql`
//     {
//         books {
//           title
//           author
//         }
//       }
//     `
//   })
//   .then(result => console.log(result));

client
  .query({
    query: gql`
    query getUser{
      course(id: 1){
        id
        title 
        
      }
    }
    `
  })
  .then(result => console.log(result));

  // query getSingleCourse($courseID: Int!) {
  //   course(id: $courseID) {
  //     title
  //     author
  //     description
  //     topic
  //     url
  //   }
  // }