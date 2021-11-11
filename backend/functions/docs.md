## POST/candidate/add

Adds a new event candidate to the candidates database along
with their basic information

### Parameters

*   `event_code` **[string][27]** 
*   `email` **[string][27]** 
*   `name` **[string][27]** 
*   `phone_number` **[string][27]** 
*   `biography` **[string][27]** 
*   `resume_id` **[string][27]** 

Returns **[string][27]** unique candidate ID if the new candidate is inserted
properly, an error message otherwise

## GET/candidate/:event_code

This endpoint retrieves a list of candidate IDs from the
Candidates database

### Parameters

*   `event_code` **[string][27]** 

Returns **[Array][28]<[String][27]>** all candidates if event_code is not specified, otherwise
candidates given the event_code

## GET/candidate/:event_code

Lists all events a ClubMember is a member of

### Parameters

*   `member_id` **[string][27]** 

Returns **[Array][28]<[Object][29]>** a list of events the ClubMember is a member or admin of

## GET/candidate/:event_code

Retrieves full detail of an event given an event_id

### Parameters

*   `event_id` **[string][27]** 

Returns **[Object][29]** event details containing eventName, eventDescription,
eventCoverPictureUrl, eventCode, accessCode, list\[members], list\[organizers],
list\[candidates]

## GET/comment/list

Lists all the comments associated with a candidate for a particular event

### Parameters

*   `event_id` **[string][27]** 
*   `candidate_id` **[string][27]** 

Returns **[Array][28]<[Object][29]>** a list of all comments for candidateID for the
particular eventID

## POST/comment/add

Adds a comment to a candidate for a particular event

### Parameters

*   `member_id` **[string][27]** 
*   `event_id` **[string][27]** 
*   `candidate_id` **[string][27]** 
*   `comment` **[string][27]** 

Returns **[string][27]** unique comment ID if the new comment is inserted
properly, an error message otherwise

## DELETE/comment/delete

Deletes a comment from comments database

### Parameters

*   `comment_id` **[string][27]** 

Returns **[string][27]** a success status message if the comment is deleted
successfully, an error message otherwise

## POST/event/add

Adds an event to the events database, and updates the candidates database

### Parameters

*   `member_id` **[string][27]** 
*   `event_name` **[string][27]** 
*   `event_description` **[string][27]** 
*   `event_cover_picture_url` **[string][27]** 

Returns **\[[string][27], [string][27]]** event_code and access_code to the frontend to
be distributed to ClubMembers as well as Candidates

## POST/event/member/:event_id

Adds a member to an event

### Parameters

*   `member_id` **[string][27]** 
*   `event_id` **[string][27]** 

Returns **[string][27]** a success message if member is successfully added, an
error message otherwise

## DELETE/event/member/:event_id

Deletes a member from an event

### Parameters

*   `member_id` **[string][27]** 
*   `event_id` **[string][27]** 

Returns **any** a success message if member is successfully deleted, an
error message otherwise

## DELETE/event/delete

Deletes an event from Events database

### Parameters

*   `member_id` **[string][27]** and
*   `event_id` **[string][27]** 

Returns **[string][27]** a success message if the event delete is successful, an
error message otherwise

## POST/member/promote

This function promotes an existing member of an event to organizer

### Parameters

*   `member_id` **[string][27]** 
*   `event_id` **[string][27]** 

Returns **any** a success message if member is successfully promoted, an
error message otherwise

## POST/member/demote

This function demotes an existing member of an event to regular member

### Parameters

*   `member_id` **[string][27]** 
*   `event_id` **[string][27]** 

Returns **any** a success message if member is successfully demoted, an
error message otherwise

[1]: #postcandidateadd

[2]: #parameters

[3]: #get

[4]: #parameters-1

[5]: #get-1

[6]: #parameters-2

[7]: #get-2

[8]: #parameters-3

[9]: #getcommentlist

[10]: #parameters-4

[11]: #postcommentadd

[12]: #parameters-5

[13]: #deletecommentdelete

[14]: #parameters-6

[15]: #posteventadd

[16]: #parameters-7

[17]: #post

[18]: #parameters-8

[19]: #delete

[20]: #parameters-9

[21]: #deleteeventdelete

[22]: #parameters-10

[23]: #postmemberpromote

[24]: #parameters-11

[25]: #postmemberdemote

[26]: #parameters-12

[27]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[28]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[29]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
