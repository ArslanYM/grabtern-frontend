import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import MentorCard from "../components/mentor";
import { debounce } from "lodash";

const Header = dynamic(() => import("../components/Header"));
const SimpleBanner = dynamic(() => import("../components/SimpleBanner"));

function Mentors({ initialMentorsData }) {
  const [mentorsData, setMentorsData] = useState(initialMentorsData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allMentorsLoaded, setAllMentorsLoaded] = useState(false);

  const handleScroll = useCallback(() => {
    if (allMentorsLoaded || loading) {
      return;
    }
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setLoading(true);
      const fetchData = async () => {
        const url = `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/mentors/mentorLists?page=${page + 1}&limit=2`;
        const { data } = await axios.get(url);

        const filteredData = data.filter(
          (mentor) =>
            mentor.verified === true && mentor.token === "mentorIsVerified"
        );

        if (filteredData.length === 0) {
          setAllMentorsLoaded(true);
        } else {
          setMentorsData((prevMentorsData) => [
            ...prevMentorsData,
            ...filteredData,
          ]);
          setPage((prevPage) => prevPage + 1);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [allMentorsLoaded, loading, page]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 200);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [handleScroll]);

  return (
    <>
      <Header />
      <SimpleBanner bannerTittle="Find Mentors" siteName="mentors" />
      <main>
        <section className="findMentors">
          <div className="container">
            <h1>Find All mentors here's</h1>
            {mentorsData.length === 0 ? (
              <p>There is no mentor right now...</p>
            ) : (
              <div className="mentorLists">
                {mentorsData.map((mentor) => (
                  <a href={`/${mentor.username}`} key={mentor._id}>
                    {<MentorCard mentor={mentor} />}
                  </a>
                ))}
                {loading && <p>Loading...</p>}
                <div style={{ height: 50 }} />
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Mentors;

export const getServerSideProps = async (context) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentors/mentorLists?page=1&limit=2`;
  const { data } = await axios.get(url);

  return {
    props: {
      initialMentorsData: data.filter(
        (mentor) =>
          mentor.verified === true && mentor.token === "mentorIsVerified"
      ),
    },
  };
};
