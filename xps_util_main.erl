-module(xps_util_main).

-export([search/2]).

-spec search(string(), string()) -> integer().

%%%
%%% search(Key, String)
%%%
%%% find the key in String, return the number of result
%%%
%%% for example:
%%% 2 = xps_util_main:search("heLLo", "Helloerlanghello").
%%% 
search(Key, String) when is_list(Key),is_list(String) ->
    search(string:to_lower(Key), string:to_lower(String), 0);
search(_Key, _String) ->
    0.

search([], _String, Result) ->
    Result;

search(_Key, [], Result) ->
    Result;

search(Key, String, Result) ->
    case do_match(Key, String) of
        true ->
            [_K|StringLeft] = String,
            search(Key, StringLeft, Result + 1);
        false ->
            [_K|StringLeft] = String,
            search(Key, StringLeft, Result)
    end.

%%%
%%% do_match(Key, String).
%%%
%%% match the key with String from the beginning to end of Key
%%% Key[0] == String[0] ... Key[N-1] == String[N-1].
%%%
%%% for instance:
%%% do_match("hello", "helloerlang") -> true
%%% do_match("ahello", "helloerlang") -> false
%%%
do_match([], _) ->
    true;
do_match(_, []) ->
    false;
do_match([], []) ->
    false;
do_match(Key, String) ->
    [K1|KeyLeft] = Key,
    [S1|StringLeft] = String,
    case K1 == S1 of
        true ->
            do_match(KeyLeft, StringLeft);
        false ->
            false
    end.
