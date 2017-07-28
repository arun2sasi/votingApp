import axios from 'axios';

// Actions
const FETCHED_POLLS = 'polls/FETCHED_POLLS';
const ADD_POLL = 'polls/ADD_POLL';
const ADD_EDIT_POLL = 'polls/ADD_EDIT_POLL';
const DELETE_POLL = 'polls/DELETE_POLL';
const UPDATE_VOTES = 'polls/UPDATE_VOTES';

// reducer
export default function Polls(state = [], action) {
  switch (action.type) {
    case FETCHED_POLLS:
      return action.polls;
    case ADD_POLL: {
      return [
        ...state,
        {
          question: action.question,
          answers: action.answers,
          indexInDb: action.indexInDb,
        },
      ];
    }
    case ADD_EDIT_POLL: {
      const addEditPoll = state.polls.map((poll, ind) => {
        if (ind === action.questionInd) {
          return {
            ...poll,
            answers: poll.answers.concat(action.answers),
          };
        }

        return poll;
      });
      return {
        ...state,
        polls: addEditPoll,
      };
    }
    case DELETE_POLL: {
      const removeQuestionList = [
        ...state.polls.slice(0, action.index),
        ...state.polls.slice(action.index + 1),
      ];
      return {
        ...state,
        polls: removeQuestionList,
      };
    }
    case UPDATE_VOTES: {
      const updateVotesList = state.polls.map((poll, ind) => {
        if (ind === action.question) {
          return {
            ...poll,
            answers: poll.answers.map((ans, index) => {
              if (index === action.index) {
                return { ...ans, votes: ans.votes + action.votes };
              }
              return ans;
            }),
          };
        }
        return poll;
      });
      return {
        ...state,
        polls: updateVotesList,
      };
    }
    default:
      return state;
  }
}

// actionCreators
function receivePolls(polls) {
  return {
    type: FETCHED_POLLS,
    polls,
  };
}

export const addPoll = (question, answers, indexInDb) => ({
  type: ADD_POLL,
  question,
  answers,
  indexInDb,
});

export const addEditPoll = (questionInd, answers) => ({
  type: ADD_EDIT_POLL,
  questionInd,
  answers,
});

export const deletePoll = index => ({
  type: DELETE_POLL,
  index,
});

export const updateVotes = (question, index, votes) => ({
  type: UPDATE_VOTES,
  question,
  index,
  votes,
});

// Async actions with thunk
export function fetchPolls() {
  return dispatch =>
		axios
			.get('/api/polls')
			.then((res) => {
  dispatch(receivePolls(res.data));
				// console.log(res);
})
			.catch((err) => {
  console.warn(err);
});
}

export function postPoll(question, answers, index) {
  return dispatch =>
		axios
			.post('/api/polls/new', addPoll(question, answers, index))
			.then(dispatch(addPoll(question, answers, index)))
			.catch((error) => {
  console.warn(error);
});
}
