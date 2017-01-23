-module(strtest).
-export([strstart/0, convert_to_bcd/1, get_ki/1]).

strstart() ->
    %Str0 = "dallas",
    Str1 = "dallas-",
    Str2 = "dallas-12",
    Str3 = "dallas-aat",
    Str4 = "dallas-aat-",
    Str5 = "dallas-aat-3",
    %io:format("~p: ~p~n", [Str0, string:substr(Str0, string:rchr(Str0, $-))]),
    io:format("~p: ~p~n", [Str1, string:substr(Str1, string:rchr(Str1, $-)+1)]),
    io:format("~p: ~p~n", [Str2, string:substr(Str2, string:rchr(Str2, $-))]),
    io:format("~p: ~p~n", [Str3, string:substr(Str3, string:rchr(Str3, $-))]),
    io:format("~p: ~p~n", [Str4, string:substr(Str4, string:rchr(Str4, $-))]),
    io:format("~p: ~p~n", [Str5, string:substr(Str5, string:rchr(Str5, $-))]).

get_ki(Imsi) ->
    ImsiReversed =
        if
            is_binary(Imsi) ->
                lists:reverse(binary_to_list(Imsi));
            true ->
                lists:reverse(Imsi)
        end,
    [LastOct|TailImsiReversed] = ImsiReversed,
    Imsi8PlainBCD =
        if
            LastOct >= 16#f0 ->
                swap_and_shift_digits(LastOct band 16#0f, lists:sublist(TailImsiReversed, 4), []);
            true ->
                swap_digits(lists:sublist(ImsiReversed, 4), [])
        end,
    ImsiPlainBCD =
        if 
            LastOct >= 16#f0 ->
                swap_digits([LastOct band 16#0f | TailImsiReversed], []);
            true ->
                swap_digits(ImsiReversed, [])
        end,
    Imsi8PlainBCD ++ ImsiPlainBCD ++
        lists:duplicate(8-length(ImsiPlainBCD), 0) ++
        [16#12, 16#34, 16#56, 16#78].

convert_to_bcd(Integer) ->
    convert_to_bcd_help(int2list(Integer), []).

convert_to_bcd_help([], Result) ->
    Result;
convert_to_bcd_help([LastDigit], Result) ->
    Result ++ [16#f0 bor LastDigit];
convert_to_bcd_help([Digit1, Digit2|Tail], Result) ->
    convert_to_bcd_help(Tail, Result ++ [(Digit2 bsl 4) bor Digit1]). 

%% api
int2list(Int) ->
    int2list(Int, []).

int2list(0, List) ->
    List;
int2list(Int, List) ->
    H = Int div 10,
    L = Int rem 10,
    int2list(H, [L] ++ List).

%% api
swap_digits([], Result) ->
    Result;
swap_digits([Oct|Tail], Result) ->
    Oct2 = ((Oct band 16#0f) bsl 4) + ((Oct band 16#f0) bsr 4),
    swap_digits(Tail, [Oct2|Result]).

%% api
swap_and_shift_digits(_DigX, [], Result) ->
    Result;
swap_and_shift_digits(DigX, [Oct|Tail], Result) ->
    swap_and_shift_digits(Oct band 16#0f, Tail, [(Oct band 16#f0) + DigX | Result]).

