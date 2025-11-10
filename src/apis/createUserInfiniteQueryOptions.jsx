import { queryOptions } from "@tanstack/react-query";



export function createUsersInfinateQueryOptions(filter) {
  return queryOptions( {
    queryKey: ['users',filter],
    queryFn: async ({pageParam = 0}) => {
      const response = await fetch(`https://funfinder-backend.vercel.app/api/opportunities?page=${pageParam}&limit=10`);
    //   const response = await fetch(`https://dummyjson.com/users/search?q=${filter}&limit=10&skip=${pageParam}`);
      const data = await response.json();
      return data;
    },
    initilPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage =  (lastPage?.page<lastPage?.totalPages)? (lastPage?.page + 1): undefined;
      return nextPage;
    },
    // keepPreviousData: false,
  })
}
