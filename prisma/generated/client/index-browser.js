
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.11.0
 * Query Engine version: efd2449663b3d73d637ea1fd226bafbcf45b3102
 */
Prisma.prismaVersion = {
  client: "5.11.0",
  engine: "efd2449663b3d73d637ea1fd226bafbcf45b3102"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BabyScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ownerId: 'ownerId'
};

exports.Prisma.BabyCaregiverScalarFieldEnum = {
  id: 'id',
  relationship: 'relationship',
  permissions: 'permissions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId',
  userId: 'userId'
};

exports.Prisma.EliminationScalarFieldEnum = {
  id: 'id',
  timestamp: 'timestamp',
  type: 'type',
  weight: 'weight',
  success: 'success',
  location: 'location',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.FeedingScalarFieldEnum = {
  id: 'id',
  startTime: 'startTime',
  endTime: 'endTime',
  type: 'type',
  side: 'side',
  amount: 'amount',
  food: 'food',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.SleepScalarFieldEnum = {
  id: 'id',
  startTime: 'startTime',
  endTime: 'endTime',
  how: 'how',
  whereFellAsleep: 'whereFellAsleep',
  whereSlept: 'whereSlept',
  type: 'type',
  quality: 'quality',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  startTime: 'startTime',
  endTime: 'endTime',
  type: 'type',
  description: 'description',
  milestone: 'milestone',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.MilestoneScalarFieldEnum = {
  id: 'id',
  date: 'date',
  category: 'category',
  title: 'title',
  description: 'description',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.HealthRecordScalarFieldEnum = {
  id: 'id',
  timestamp: 'timestamp',
  type: 'type',
  value: 'value',
  description: 'description',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.MeasurementScalarFieldEnum = {
  id: 'id',
  date: 'date',
  weight: 'weight',
  height: 'height',
  headCirc: 'headCirc',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.AlbumScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  babyId: 'babyId'
};

exports.Prisma.PhotoScalarFieldEnum = {
  id: 'id',
  url: 'url',
  caption: 'caption',
  timestamp: 'timestamp',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BabyPhotoScalarFieldEnum = {
  babyId: 'babyId',
  photoId: 'photoId',
  createdAt: 'createdAt'
};

exports.Prisma.AlbumPhotoScalarFieldEnum = {
  albumId: 'albumId',
  photoId: 'photoId',
  createdAt: 'createdAt'
};

exports.Prisma.ActivityPhotoScalarFieldEnum = {
  activityId: 'activityId',
  photoId: 'photoId',
  createdAt: 'createdAt'
};

exports.Prisma.MilestonePhotoScalarFieldEnum = {
  milestoneId: 'milestoneId',
  photoId: 'photoId',
  createdAt: 'createdAt'
};

exports.Prisma.AlbumAccessScalarFieldEnum = {
  id: 'id',
  permissions: 'permissions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  albumId: 'albumId',
  userId: 'userId'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  authorId: 'authorId'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  postId: 'postId',
  authorId: 'authorId'
};

exports.Prisma.ParentInviteScalarFieldEnum = {
  id: 'id',
  email: 'email',
  babyId: 'babyId',
  senderId: 'senderId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  Baby: 'Baby',
  BabyCaregiver: 'BabyCaregiver',
  Elimination: 'Elimination',
  Feeding: 'Feeding',
  Sleep: 'Sleep',
  Activity: 'Activity',
  Milestone: 'Milestone',
  HealthRecord: 'HealthRecord',
  Measurement: 'Measurement',
  Album: 'Album',
  Photo: 'Photo',
  BabyPhoto: 'BabyPhoto',
  AlbumPhoto: 'AlbumPhoto',
  ActivityPhoto: 'ActivityPhoto',
  MilestonePhoto: 'MilestonePhoto',
  AlbumAccess: 'AlbumAccess',
  Post: 'Post',
  Comment: 'Comment',
  ParentInvite: 'ParentInvite'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
