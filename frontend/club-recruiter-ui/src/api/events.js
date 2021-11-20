/* eslint-disable no-unused-vars */
// TODO: Query backend for list of events for a member
const listMemberEvents = async (memberID) => ['123', '456', '789'];

const joinEvent = async (candidateCode, memberID) => true;

const listEventMembers = async (candidateCode) => ['Tian Yu Liu', 'Wen Hong Lam'];

const listEventOrganizers = async (candidateCode) => ['Zacharye', 'Jackson', 'Rex'];

const getEventDetails = async (candidateCode) => {
  const details = {
    candidateCode,
    memberCode: 'WeLoveUSC',
    title: 'Zeta Zeta Zeta Rush',
    description: 'Fall 2021 ZZZ Rush.',
    imageLink: 'https://www.logolynx.com/images/logolynx/6c/6c7854a6d47c80ca417063d1c36fd4e9.jpeg',
  };
  return details;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  listMemberEvents,
  joinEvent,
  listEventMembers,
  listEventOrganizers,
  getEventDetails,
};
