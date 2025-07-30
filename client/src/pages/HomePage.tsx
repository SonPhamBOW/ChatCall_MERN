import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type JSX } from "react";
import {
  getOutgoingFriendRequest,
  getRecommendUsers,
  getUserFriends,
  sendFriendRequest,
} from "../apis/User.api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriends from "../components/NoFriends";
import { LANGUAGE_TO_FLAG } from "../constants";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outGoingRequestIds, setOutGoingRequestIds] = useState([]);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendUsers = [], isLoading: loadingRecommendUsers } =
    useQuery({
      queryKey: ["users"],
      queryFn: getRecommendUsers,
    });

  const { data: outGoingFriendReqs } = useQuery({
    queryKey: ["outGoingFriendReqs"],
    queryFn: getOutgoingFriendRequest,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outGoingFriendReqs"] });
    },
    onError: (error) => {
      console.log(error.response.data.message);
    },
  });

  useEffect(() => {
  if (
    outGoingFriendReqs?.outGoingReq &&
    outGoingFriendReqs.outGoingReq.length > 0
  ) {
    const outgoingIds = outGoingFriendReqs.outGoingReq.map((req) => req.recipient);
    setOutGoingRequestIds(outgoingIds);
  } else {
    setOutGoingRequestIds([]);
  }
}, [outGoingFriendReqs]);

  const getLanguageFlag = (language: string): JSX.Element | null => {
    if (!language) return null;

    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];

    if (countryCode) {
      return (
        <img
          src={`https://flagcdn.com/24x18/${countryCode}.png`}
          alt={`${language} flag`}
          className="h-3 mr-1 inline-block"
        />
      );
    }

    return null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 overflow-auto max-h-screen">
      <div className="container mx-auto space-y-10">
        <div
          className="flex flex-col sm:flex-row items-start 
        sm:items-center justify-between gap-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to={"/notifications"} className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : !Array.isArray(friends) || friends.length === 0 ? (
          <NoFriends />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto space-y-10">
        <div
          className="flex flex-col items-start 
         gap-2"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Meet new learners
          </h2>
          <p className="text-sm tracking-tight">
            Discover perfect language exchange partners based on your profile
          </p>
        </div>

        {loadingRecommendUsers ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : recommendUsers.length === 0 ? (
          <p>No suitable friends</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {recommendUsers.map((user) => {
              const hasRequestBeenSent = outGoingRequestIds.includes(user._id);
              // console.log(user._id);
              
              return (
                <div
                  key={user._id}
                  className="card bg-base-200 hover:shadow-lg
              transition-all duration-300"
                >
                  <div className="card-body p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img src={user.profilePic} alt={user.fullName} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {user.fullName}
                        </h3>
                        {user.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="badge badge-secondary text-xs">
                        {getLanguageFlag(user.nativeLanguage)}
                        Native: {user.nativeLanguage}
                      </span>

                      <span className="badge badge-secondary text-xs">
                        {getLanguageFlag(user.languageLearning)}
                        Learning: {user.languageLearning}
                      </span>
                    </div>

                    <div>{user.bio ? <p>{user.bio}</p> : <p>Bio...</p>}</div>

                    <button
                      className={`btn w-full mt-2 ${
                        hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                      }`}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={isPending || hasRequestBeenSent}
                    >
                      {hasRequestBeenSent ? (
                        <div className="flex items-center">
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request Sent
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
