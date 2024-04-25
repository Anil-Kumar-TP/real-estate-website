import React from 'react'
import Spinner from 'components/Spinner';
import { db } from '../firebase';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ListingItem from 'components/ListingItem';
import { useParams } from 'react-router-dom';

export default function Category () {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);
    const params = useParams();

    useEffect(() => {
        async function fetchListings () {
            try {
                const listingRef = collection(db, "listings");
                const q = query(listingRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(8));
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchedListing(lastVisible);
                let listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                setListings(listings);
                setLoading(false);
            } catch (error) {
                toast.error("Could not fetch offers");
            }
        }
        fetchListings()
    }, [params.categoryName]);

    async function onFetchMoreListings () {
        try {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), startAfter(lastFetchedListing), limit(4));
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchedListing(lastVisible);
            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings((prev) => [
                ...prev, ...listings
            ]);
            setLoading(false);
        } catch (error) {
            toast.error("Could not fetch offers");
        }
    }
  return (
      <div className='max-w-6xl mx-auto px-3'>
          <h1 className='text-3xl text-center mt-6 font-bold mb-6'>{params.categoryName === "rent" ? "Places for Rent" :"Places for Sale"}</h1>
          {loading ? (
              <Spinner />
          ) : listings && listings.length > 0 ? (
              <>
                  <main>
                      <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                          {listings.map((listing) => (
                              <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                          ))}
                      </ul>
                  </main>
                  {lastFetchedListing && (
                      <div className='flex justify-center items-center'>
                          <button onClick={onFetchMoreListings} className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'>Load More</button>
                      </div>
                  )}
              </>
          ) : (
            <p>{params.categoryName === "rent" ? "No new places for rent":"No new places for sale"}</p>
          )}
      </div>
  )
}
