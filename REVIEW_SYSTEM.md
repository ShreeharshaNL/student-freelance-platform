# Review & Rating System

## ✅ Complete Implementation

### Backend

#### Models
- **Review.js** - Complete review model with:
  - Project, reviewer, reviewee references
  - Rating (1-5 stars)
  - Comment (max 1000 chars)
  - Category ratings (communication, quality, professionalism, timeliness)
  - Public/private visibility
  - Response capability
  - Unique constraint: One review per user per project

#### Controllers (reviewController.js)
- `createReview` - Submit a new review
- `getReviewsForUser` - Get all reviews for a specific user (paginated)
- `getReviewsForProject` - Get all reviews for a project
- `getMyReviews` - Get reviews received/given by current user
- `respondToReview` - Allow reviewees to respond to reviews
- `canReview` - Check if user can review a project
- `deleteReview` - Delete own review
- `updateUserRating` - Automatically updates user profile ratings

#### Routes (reviewRoutes.js)
- `POST /api/reviews` - Create review
- `GET /api/reviews/my-reviews?type=received|given` - My reviews
- `GET /api/reviews/user/:userId` - User's reviews
- `GET /api/reviews/project/:projectId` - Project reviews
- `GET /api/reviews/can-review/:projectId` - Check eligibility
- `POST /api/reviews/:reviewId/respond` - Respond to review
- `DELETE /api/reviews/:reviewId` - Delete review

### Frontend

#### Components
1. **ReviewModal.jsx** - Modal for submitting reviews
   - Overall star rating (1-5)
   - Category-specific ratings (optional)
   - Comment textarea (1000 char limit)
   - Form validation
   - Loading states

2. **ReviewCard.jsx** - Display individual reviews
   - Reviewer info and avatar
   - Star ratings
   - Comment text
   - Category breakdown
   - Project link
   - Response display
   - Response form (for reviewees)

#### API Utility (reviewsAPI.js)
- All API calls wrapped in clean functions
- Error handling
- Response normalization

#### Integration Points

**Student Side:**
- **StudentActiveProjects.jsx** - "Leave Review" button on completed projects
- **StudentProfile.jsx** - (Ready for reviews display)

**Client Side:**
- **ClientActive.jsx** - "Leave Review" button for completed hires
- **ClientProfileView.jsx** - Reviews section with full display

### Features

✅ **5-Star Rating System**
✅ **Detailed Category Ratings** (Communication, Quality, Professionalism, Timeliness)
✅ **Written Reviews** with character limits
✅ **Automatic Rating Calculations** - Updates user profiles
✅ **One Review Per Project** - Prevents duplicate reviews
✅ **Review Responses** - Users can respond to reviews about them
✅ **Public/Private Reviews**
✅ **Review Deletion** - Users can delete their own reviews
✅ **Paginated Review Display**
✅ **Review Eligibility Check** - Only for completed projects
✅ **Real-time Updates** - Ratings update immediately

### How It Works

1. **Project Completion** → "Leave Review" button appears
2. **Click Button** → Review modal opens
3. **Submit Review** → 
   - Review saved to database
   - Reviewee's rating automatically updated
   - Review appears on profile
4. **Reviewee Can Respond** → Response shown below review
5. **Reviews Display** → Shows on profile pages with star ratings

### Usage

**Student reviews client after project completion:**
```javascript
// On StudentActiveProjects page
<button onClick={() => openReviewModal(project, client)}>
  ⭐ Leave Review
</button>
```

**Client reviews student after hiring:**
```javascript
// On ClientActive page
<button onClick={() => openReviewModal(project, student)}>
  ⭐ Leave Review
</button>
```

**Reviews display on profiles:**
```javascript
// On ClientProfileView or StudentProfile
<ReviewCard 
  review={review} 
  currentUserId={user._id}
  onUpdate={fetchReviews}
/>
```

### Database Schema

```javascript
{
  project: ObjectId,
  reviewer: ObjectId,
  reviewee: ObjectId,
  reviewerRole: "student" | "client",
  rating: Number (1-5),
  comment: String (max 1000),
  categories: {
    communication: Number (1-5),
    quality: Number (1-5),
    professionalism: Number (1-5),
    timeliness: Number (1-5)
  },
  isPublic: Boolean,
  response: {
    comment: String,
    createdAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Next Enhancements (Optional)

- [ ] Review moderation system
- [ ] Report inappropriate reviews
- [ ] Review analytics dashboard
- [ ] Review reminders (email/notification)
- [ ] Verified reviews badge
- [ ] Review sorting (most recent, highest rated)
- [ ] Review filtering by rating
- [ ] Helpful/unhelpful votes
