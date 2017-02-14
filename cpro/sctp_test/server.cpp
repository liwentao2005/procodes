#include "server.h"
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
#include <stdio.h>
#include <arpa/inet.h>

SctpServer::SctpServer()
    :streamIncrement_(1)
{

}

void SctpServer::listenSocket(void)
{
    // create sctp socket
    sockFd_ = socket(AF_INET, SOCK_SEQPACKET, IPPROTO_SCTP);
    bzero(&serverAddr_, sizeof(serverAddr_));
    serverAddr_.sin_family = AF_INET;
    serverAddr_.sin_addr.s_addr = htonl(INADDR_ANY);
    serverAddr_.sin_port = htons(SERVER_PORT);
    inet_pton(AF_INET, "127.0.0.1", &serverAddr_.sin_addr);

    // bind address
    bind(sockFd_, (struct sockaddr*)&serverAddr_, sizeof(serverAddr_));

    // set sctp notification event
    bzero(&events_, sizeof(events_));
    events_.sctp_data_io_event = 1;
    setsockopt(sockFd_, IPPROTO_SCTP, SCTP_EVENTS, &events_, sizeof(events_));

    // listen
    listen(sockFd_, LISTEN_QUEUE);
}

void SctpServer::loop(void)
{
    while (true)
    {
        len_ = sizeof(struct sockaddr_in);

        readSize_ = sctp_recvmsg(sockFd_,readBuf_,BUFFER_SIZE,
                    (struct sockaddr *)&clientAddr_,&len_,&sri_,&msgFlags_);

        if(streamIncrement_)
        {
            sri_.sinfo_stream++;
        }
        sctp_sendmsg(sockFd_,readBuf_,readSize_,
                        (struct sockaddr *)&clientAddr_,len_,
                        sri_.sinfo_ppid,sri_.sinfo_flags,sri_.sinfo_stream,0,0);
    }
}

void SctpServer::start(void)
{
    listenSocket();
    loop();
}
