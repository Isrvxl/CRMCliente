import { ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from 'apollo-link-context'

const httpLink = createHttpLink({
    uri: 'https://immense-lowlands-59929.herokuapp.com/'
});

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat( httpLink )
});

export default client