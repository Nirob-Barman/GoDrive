namespace CleanArchitecture.Application.Dashboard.Common;

// Query-shape only, never persisted - unlike the Domain enums, which represent stored state.
public enum RevenuePeriod
{
    Daily,
    Weekly,
    Monthly,
    Yearly
}
