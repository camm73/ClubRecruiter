## Functions

<dl>
<dt><a href="#validateCandidateCode">validateCandidateCode(candidate_code)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates a candidate_code</p>
</dd>
<dt><a href="#isAdmin">isAdmin(member_id, event_id)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checkes whether or not a member is the admin of an event</p>
</dd>
<dt><a href="#deleteFile">deleteFile(filename)</a> ⇒ <code>void</code></dt>
<dd><p>Deletes a file from Cloud Storage buckets</p>
</dd>
<dt><a href="#GET/candidate/validate">GET/candidate/validate(candidate_code)</a> ⇒ <code>Object</code></dt>
<dd><p>Validates a candidate_code submitted to our backend</p>
</dd>
<dt><a href="#GET/candidate/_candidate_id">GET/candidate/:candidate_id(candidate_id)</a> ⇒ <code>Object</code></dt>
<dd><p>Gets a candidate&#39;s detail given its id</p>
</dd>
<dt><a href="#POST/candidate/apply">POST/candidate/apply(candidate_code, email, name, phone_number, biography, resume_id, profile_pic_id)</a> ⇒ <code>string</code></dt>
<dd><p>A new event candidate applies to an event, backend adds the candidate to the
the candidates database along with their basic information</p>
</dd>
<dt><a href="#POST/candidate/status">POST/candidate/status(status, candidate_id)</a> ⇒ <code>string</code></dt>
<dd><p>Updates a candidate&#39;s status to either &quot;accepted&quot;, &quot;rejected&quot;, or &quot;pending&quot;</p>
</dd>
<dt><a href="#GET/by_event/_event_id">GET/by_event/:event_id(event_id)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>This endpoint retrieves a list of candidate IDs from the
Candidates database</p>
</dd>
<dt><a href="#DELETE/candidate/delete">DELETE/candidate/delete(candidate_id, member_id)</a> ⇒ <code>string</code></dt>
<dd><p>Deletes a candidate given their candidate_id</p>
</dd>
<dt><a href="#GET/comment/by_candidate/_candidate_id">GET/comment/by_candidate/:candidate_id(candidate_id)</a> ⇒ <code>Object</code></dt>
<dd><p>Lists all the comments associated with a candidate for a particular event</p>
</dd>
<dt><a href="#GET/comment/_comment_id">GET/comment/:comment_id(comment_id)</a> ⇒ <code>Object</code></dt>
<dd><p>Gets a comment&#39;s detail given its id</p>
</dd>
<dt><a href="#POST/comment/add">POST/comment/add(member_id, candidate_id, event_id, comment)</a> ⇒ <code>string</code></dt>
<dd><p>Adds a comment to a candidate for a particular event</p>
</dd>
<dt><a href="#DELETE/comment/delete">DELETE/comment/delete(comment_id)</a> ⇒ <code>string</code></dt>
<dd><p>Deletes a comment from comments database</p>
</dd>
<dt><a href="#POST/email">POST/email(member_id, email_subject, email_body, event_id, candidate_ids)</a> ⇒ <code>Object</code></dt>
<dd><p>Sends a basic email to the given candidate</p>
</dd>
<dt><a href="#GET/event/is_admin">GET/event/is_admin(member_id, event_id)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks whether or not the current member is an admin of the given event</p>
</dd>
<dt><a href="#GET/event/by_member">GET/event/by_member(member_id)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Lists all events a ClubMember is a member of</p>
</dd>
<dt><a href="#GET/event/_event_id">GET/event/:event_id(event_id)</a> ⇒ <code>Object</code></dt>
<dd><p>Retrieves full detail of an event given an event_id</p>
</dd>
<dt><a href="#POST/event/create">POST/event/create(member_id, event_name, event_description, event_cover_pic_id)</a> ⇒ <code>Object</code></dt>
<dd><p>Adds an event to the events database, and updates the candidates database</p>
</dd>
<dt><a href="#POST/event/member_join">POST/event/member_join(member_id, member_code)</a> ⇒ <code>string</code></dt>
<dd><p>A member joins an event given the member_code</p>
</dd>
<dt><a href="#POST/event/member_add">POST/event/member_add(member_id, event_id, target_id)</a> ⇒ <code>string</code></dt>
<dd><p>Admin adds member to a given event</p>
</dd>
<dt><a href="#DELETE/event/delete_member">DELETE/event/delete_member(target_id, event_id)</a> ⇒</dt>
<dd><p>Deletes a member from an event</p>
</dd>
<dt><a href="#DELETE/event/delete">DELETE/event/delete(member_id, event_id)</a> ⇒ <code>string</code></dt>
<dd><p>Deletes an event from Events database</p>
</dd>
<dt><a href="#GET/member/_member_id">GET/member/:member_id(member_id)</a> ⇒ <code>Object</code></dt>
<dd><p>Gets a member&#39;s detail given its id</p>
</dd>
<dt><a href="#POST/member/promote">POST/member/promote(member_id, target_id, event_id)</a> ⇒</dt>
<dd><p>This function promotes an existing member of an event to organizer</p>
</dd>
<dt><a href="#POST/member/demote">POST/member/demote(member_id, target_id, event_id)</a> ⇒</dt>
<dd><p>This function demotes an existing member of an event to regular member</p>
</dd>
<dt><a href="#POST/member/add">POST/member/add(member_id, target_id, event_id)</a> ⇒ <code>string</code></dt>
<dd><p>Adds a member to an event</p>
</dd>
<dt><a href="#POST/member/_target_id">POST/member/:target_id(member_id, target_id, event_id)</a> ⇒</dt>
<dd><p>Deletes a member from an event</p>
</dd>
</dl>

<a name="validateCandidateCode"></a>

## validateCandidateCode(candidate_code) ⇒ <code>boolean</code>
Validates a candidate_code

**Kind**: global function  
**Returns**: <code>boolean</code> - true if the candidate code is valid, false otherwise  

| Param | Type |
| --- | --- |
| candidate_code | <code>string</code> | 

<a name="isAdmin"></a>

## isAdmin(member_id, event_id) ⇒ <code>boolean</code>
Checkes whether or not a member is the admin of an event

**Kind**: global function  
**Returns**: <code>boolean</code> - true if member_id is an admin of event_id, false
otherwise  

| Param | Type |
| --- | --- |
| member_id | <code>string</code> | 
| event_id | <code>string</code> | 

<a name="deleteFile"></a>

## deleteFile(filename) ⇒ <code>void</code>
Deletes a file from Cloud Storage buckets

**Kind**: global function  
**Returns**: <code>void</code> - Nothing  

| Param | Type |
| --- | --- |
| filename | <code>string</code> | 

<a name="GET/candidate/validate"></a>

## GET/candidate/validate(candidate_code) ⇒ <code>Object</code>
Validates a candidate_code submitted to our backend

**Kind**: global function  
**Returns**: <code>Object</code> - 200 success message containing valid field taking on 
value based on validity of candidate_code. Returns 404 with error message otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| candidate_code | <code>string</code> | candidate_code of an event |

<a name="GET/candidate/_candidate_id"></a>

## GET/candidate/:candidate\_id(candidate_id) ⇒ <code>Object</code>
Gets a candidate's detail given its id

**Kind**: global function  
**Returns**: <code>Object</code> - 200 success message containing the following candidate details if
candidate_id is valid: name, biography, event_id, profile_pic_id, candidate_code, email, 
resume_id, comments and application_status. Returns 404 with error message otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| candidate_id | <code>string</code> | the unique id of the candidate |

<a name="POST/candidate/apply"></a>

## POST/candidate/apply(candidate_code, email, name, phone_number, biography, resume_id, profile_pic_id) ⇒ <code>string</code>
A new event candidate applies to an event, backend adds the candidate to the
the candidates database along with their basic information

**Kind**: global function  
**Returns**: <code>string</code> - 200 success message containing unique candidate ID if the new 
candidate is inserted properly. Returns 404 with error message otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| candidate_code | <code>string</code> | candidate_code for the event |
| email | <code>string</code> | email of candidate |
| name | <code>string</code> | name of candidate |
| phone_number | <code>string</code> | phone number of candidate |
| biography | <code>string</code> | biography of candidate |
| resume_id | <code>string</code> | id of resume uploaded by candidate |
| profile_pic_id | <code>string</code> | id of profile picture uploaded by candidate |

<a name="POST/candidate/status"></a>

## POST/candidate/status(status, candidate_id) ⇒ <code>string</code>
Updates a candidate's status to either "accepted", "rejected", or "pending"

**Kind**: global function  
**Returns**: <code>string</code> - 200 success message if update is successful. 
Returns 404 with error message otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| status | <code>string</code> | status to set candidate's application to |
| candidate_id | <code>string</code> | unique id of candidate |

<a name="GET/by_event/_event_id"></a>

## GET/by\_event/:event\_id(event_id) ⇒ <code>Array.&lt;string&gt;</code>
This endpoint retrieves a list of candidate IDs from the
Candidates database

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - 200 success message with field candidate_ids, an array of 
candidate_ids corresponding to candidates of the event. Returns 404 with error message 
otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| event_id | <code>string</code> | unique id of the event |

<a name="DELETE/candidate/delete"></a>

## DELETE/candidate/delete(candidate_id, member_id) ⇒ <code>string</code>
Deletes a candidate given their candidate_id

**Kind**: global function  
**Returns**: <code>string</code> - 200 success message if delete is successful. 
Returns 404 with error message otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| candidate_id | <code>string</code> | unique id of candidate |
| member_id | <code>string</code> | unique id of member in the event |

<a name="GET/comment/by_candidate/_candidate_id"></a>

## GET/comment/by\_candidate/:candidate\_id(candidate_id) ⇒ <code>Object</code>
Lists all the comments associated with a candidate for a particular event

**Kind**: global function  
**Returns**: <code>Object</code> - 200 success message containing comment_ids field which is an array of 
ids corresponding to each comment on a candidate. Returns 404 with error message otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| candidate_id | <code>string</code> | unique id of candidate |

<a name="GET/comment/_comment_id"></a>

## GET/comment/:comment\_id(comment_id) ⇒ <code>Object</code>
Gets a comment's detail given its id

**Kind**: global function  
**Returns**: <code>Object</code> - 200 success message containing the fields comment, member_id, 
candidate_id, event_id, timestamp if comment_id is valid. Returns 404 with error message 
otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| comment_id | <code>string</code> | unique id of a comment on a candidate |

<a name="POST/comment/add"></a>

## POST/comment/add(member_id, candidate_id, event_id, comment) ⇒ <code>string</code>
Adds a comment to a candidate for a particular event

**Kind**: global function  
**Returns**: <code>string</code> - 200 success message containing a comment_id if the comment is properly 
inserted. Returns 404 with error message otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| member_id | <code>string</code> | unique id of a member of the event |
| candidate_id | <code>string</code> | unique id of candidate of that event |
| event_id | <code>string</code> | unique id of the event |
| comment | <code>string</code> | comment to add to candidate specified by candidate_id |

<a name="DELETE/comment/delete"></a>

## DELETE/comment/delete(comment_id) ⇒ <code>string</code>
Deletes a comment from comments database

**Kind**: global function  
**Returns**: <code>string</code> - 200 success message if comment is successfully deleted. Returns 404 
with error message otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| comment_id | <code>string</code> | unique id of comment |

<a name="POST/email"></a>

## POST/email(member_id, email_subject, email_body, event_id, candidate_ids) ⇒ <code>Object</code>
Sends a basic email to the given candidate

**Kind**: global function  
**Returns**: <code>Object</code> - member detail with member_id  

| Param | Type | Description |
| --- | --- | --- |
| member_id | <code>string</code> | for validation purposes only |
| email_subject | <code>string</code> | The title of the email |
| email_body | <code>string</code> | The body of the meail. Completely optional, if not present, will use the default EMAIL_TEMPLATE |
| event_id | <code>string</code> | the event_id that is sending out the acceptance/rejection emails |
| candidate_ids | <code>Array.&lt;string&gt;</code> | the list of candidate_ids that we're sending out emails to |

<a name="GET/event/is_admin"></a>

## GET/event/is\_admin(member_id, event_id) ⇒ <code>boolean</code>
Checks whether or not the current member is an admin of the given event

**Kind**: global function  
**Returns**: <code>boolean</code> - true if the current member is an admin of event_id,
false otherwise  

| Param | Type |
| --- | --- |
| member_id | <code>string</code> | 
| event_id | <code>string</code> | 

<a name="GET/event/by_member"></a>

## GET/event/by\_member(member_id) ⇒ <code>Array.&lt;string&gt;</code>
Lists all events a ClubMember is a member of

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of event_id's the ClubMember is a member or admin of  

| Param | Type |
| --- | --- |
| member_id | <code>string</code> | 

<a name="GET/event/_event_id"></a>

## GET/event/:event\_id(event_id) ⇒ <code>Object</code>
Retrieves full detail of an event given an event_id

**Kind**: global function  
**Returns**: <code>Object</code> - event details containing eventName, eventDescription,
eventCoverPictureUrl, eventCode, accessCode, list[members], list[organizers],
list[candidates]  

| Param | Type |
| --- | --- |
| event_id | <code>string</code> | 

<a name="POST/event/create"></a>

## POST/event/create(member_id, event_name, event_description, event_cover_pic_id) ⇒ <code>Object</code>
Adds an event to the events database, and updates the candidates database

**Kind**: global function  
**Returns**: <code>Object</code> - candidate_code and member_code to the frontend to
be distributed to ClubMembers as well as Candidates  

| Param | Type |
| --- | --- |
| member_id | <code>string</code> | 
| event_name | <code>string</code> | 
| event_description | <code>string</code> | 
| event_cover_pic_id | <code>string</code> | 

<a name="POST/event/member_join"></a>

## POST/event/member\_join(member_id, member_code) ⇒ <code>string</code>
A member joins an event given the member_code

**Kind**: global function  
**Returns**: <code>string</code> - the candidate code of the event if successful, an
error message otherwise  

| Param | Type |
| --- | --- |
| member_id | <code>string</code> | 
| member_code | <code>string</code> | 

<a name="POST/event/member_add"></a>

## POST/event/member\_add(member_id, event_id, target_id) ⇒ <code>string</code>
Admin adds member to a given event

**Kind**: global function  
**Returns**: <code>string</code> - the candidate code of the event if successful, an
error message otherwise  

| Param | Type |
| --- | --- |
| member_id | <code>string</code> | 
| event_id | <code>string</code> | 
| target_id | <code>string</code> | 

<a name="DELETE/event/delete_member"></a>

## DELETE/event/delete\_member(target_id, event_id) ⇒
Deletes a member from an event

**Kind**: global function  
**Returns**: a success message if member is successfully deleted, an
error message otherwise  

| Param | Type | Description |
| --- | --- | --- |
| target_id | <code>string</code> | is the member_id that we wish to delete |
| event_id | <code>string</code> |  |

<a name="DELETE/event/delete"></a>

## DELETE/event/delete(member_id, event_id) ⇒ <code>string</code>
Deletes an event from Events database

**Kind**: global function  
**Returns**: <code>string</code> - a success message if the event delete is successful, an
error message otherwise  

| Param | Type | Description |
| --- | --- | --- |
| member_id | <code>string</code> | and |
| event_id | <code>string</code> |  |

<a name="GET/member/_member_id"></a>

## GET/member/:member\_id(member_id) ⇒ <code>Object</code>
Gets a member's detail given its id

**Kind**: global function  
**Returns**: <code>Object</code> - member detail with member_id  

| Param | Type |
| --- | --- |
| member_id | <code>string</code> | 

<a name="POST/member/promote"></a>

## POST/member/promote(member_id, target_id, event_id) ⇒
This function promotes an existing member of an event to organizer

**Kind**: global function  
**Returns**: a success message if member is successfully promoted, an
error message otherwise  

| Param | Type | Description |
| --- | --- | --- |
| member_id | <code>string</code> |  |
| target_id | <code>string</code> | id of the member to promote |
| event_id | <code>string</code> |  |

<a name="POST/member/demote"></a>

## POST/member/demote(member_id, target_id, event_id) ⇒
This function demotes an existing member of an event to regular member

**Kind**: global function  
**Returns**: a success message if member is successfully demoted, an
error message otherwise  

| Param | Type | Description |
| --- | --- | --- |
| member_id | <code>string</code> |  |
| target_id | <code>string</code> | id of the member to demote |
| event_id | <code>string</code> |  |

<a name="POST/member/add"></a>

## POST/member/add(member_id, target_id, event_id) ⇒ <code>string</code>
Adds a member to an event

**Kind**: global function  
**Returns**: <code>string</code> - a success message if member is successfully added, an
error message otherwise  

| Param | Type | Description |
| --- | --- | --- |
| member_id | <code>string</code> |  |
| target_id | <code>string</code> | id of member to add to event |
| event_id | <code>string</code> |  |

<a name="POST/member/_target_id"></a>

## POST/member/:target\_id(member_id, target_id, event_id) ⇒
Deletes a member from an event

**Kind**: global function  
**Returns**: a success message if member is successfully deleted, an
error message otherwise  

| Param | Type | Description |
| --- | --- | --- |
| member_id | <code>string</code> |  |
| target_id | <code>string</code> | id of member to delete from event |
| event_id | <code>string</code> |  |

